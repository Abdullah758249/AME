"use server";

import { put, list, del } from "@vercel/blob";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "./prisma";
import { requireAdmin, createAdminSession, destroyAdminSession } from "@/lib/server/session";
import { validateCsrf } from "@/lib/server/csrf";
import { logAudit } from "./audit";
import { sanitizeHtml, stripHtml } from "./sanitize";
import { slugify } from "./slug";
import { normalizeMediaUrl } from "./media-url";
import {
  generateTotpSecret,
  getTotpUri,
  verifyTotp,
} from "./totp";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// --------------------- Helper functions ---------------------
async function assertCsrf(csrfToken: string) {
  if (!(await validateCsrf(csrfToken))) {
    throw new Error("CSRF_VALIDATION_FAILED");
  }
}

async function getIp(): Promise<string | undefined> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined;
}

async function getAdminSessionSafe() {
  try {
    return await requireAdmin();
  } catch {
    return null;
  }
}

// --------------------- Authentication ---------------------
export async function adminLogin(
  email: string,
  password: string,
  totpCode: string | undefined,
  csrfToken: string
) {
  await assertCsrf(csrfToken);

  const cleanEmail = email.toLowerCase().trim();

  const user = await prisma.adminUser.findUnique({
    where: { email: cleanEmail },
  });

  // سطر كاشف للأخطاء في الـ Localhost: يطبع في الـ Terminal حالة الحساب
  console.log("=== فحص الدخول محلياً ===");
  console.log("المستخدم المدخل:", cleanEmail);
  console.log("هل الحساب موجود في قاعدة البيانات؟:", user ? "نعم موجود ✅" : "لا، غير موجود ❌");

  if (!user) return { error: "Invalid credentials" };

  const valid = await bcrypt.compare(password, user.passwordHash);
  console.log("هل كلمة المرور مطابقة؟:", valid ? "نعم متطابقة ومستقرة ✅" : "لا، كلمة المرور خاطئة ❌");
  console.log("========================");

  if (!valid) return { error: "Invalid credentials" };

  if (user.totpEnabled && user.totpSecret) {
    if (!totpCode || !verifyTotp(totpCode, user.totpSecret)) {
      return { error: "2FA required", needs2fa: true };
    }
  }

  const h = await headers();
  await createAdminSession(
    user.id,
    await getIp(),
    h.get("user-agent") ?? undefined
  );
  await logAudit({
    userId: user.id,
    action: "LOGIN",
    ipAddress: await getIp(),
  });

  return { ok: true };
}

export async function adminLogout(csrfToken: string) {
  const user = await getAdminSessionSafe();
  await assertCsrf(csrfToken);
  if (user) {
    await logAudit({ userId: user.id, action: "LOGOUT", ipAddress: await getIp() });
  }
  await destroyAdminSession();
  return { ok: true };
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  csrfToken: string
) {
  const user = await requireAdmin();
  await assertCsrf(csrfToken);

  const dbUser = await prisma.adminUser.findUniqueOrThrow({
    where: { id: user.id },
  });
  const valid = await bcrypt.compare(currentPassword, dbUser.passwordHash);
  if (!valid) return { error: "Current password incorrect" };

  if (newPassword.length < 12) {
    return { error: "Password must be at least 12 characters" };
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { passwordHash },
  });
  await logAudit({
    userId: user.id,
    action: "PASSWORD_CHANGE",
    ipAddress: await getIp(),
  });
  return { ok: true };
}

export async function setupTotp(csrfToken: string) {
  const user = await requireAdmin();
  await assertCsrf(csrfToken);

  const secret = generateTotpSecret(user.email);
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { totpSecret: secret, totpEnabled: false },
  });

  const uri = getTotpUri(secret, user.email);
  return { secret, uri };
}

export async function enableTotp(code: string, csrfToken: string) {
  const user = await requireAdmin();
  await assertCsrf(csrfToken);

  const dbUser = await prisma.adminUser.findUniqueOrThrow({
    where: { id: user.id },
  });
  if (!dbUser.totpSecret) return { error: "Setup TOTP first" };
  if (!verifyTotp(code, dbUser.totpSecret)) return { error: "Invalid code" };

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { totpEnabled: true },
  });
  await logAudit({
    userId: user.id,
    action: "2FA_ENABLED",
    ipAddress: await getIp(),
  });
  return { ok: true };
}

export async function disableTotp(code: string, csrfToken: string) {
  const user = await requireAdmin();
  await assertCsrf(csrfToken);

  const dbUser = await prisma.adminUser.findUniqueOrThrow({
    where: { id: user.id },
  });
  if (!dbUser.totpSecret || !verifyTotp(code, dbUser.totpSecret)) {
    return { error: "Invalid code" };
  }

  await prisma.adminUser.update({
    where: { id: user.id },
    data: { totpEnabled: false, totpSecret: null },
  });
  await logAudit({
    userId: user.id,
    action: "2FA_DISABLED",
    ipAddress: await getIp(),
  });
  return { ok: true };
}

// --------------------- Site Settings ---------------------
export async function updateSiteSettings(
  data: Record<string, string | undefined>,
  csrfToken: string
) {
  const user = await requireAdmin();
  await assertCsrf(csrfToken);

  const allowed = new Set([
    "companyNameAr", "companyNameEn", "taglineAr", "taglineEn", "logoUrl", "faviconUrl",
    "phone", "email", "addressAr", "addressEn", "aboutAr", "aboutEn", "visionAr", "visionEn",
    "missionAr", "missionEn", "valuesAr", "valuesEn", "homeIntroAr", "homeIntroEn",
    "metaDescriptionAr", "metaDescriptionEn",
  ]);
  const clean: Record<string, string | null> = {};
  for (const [k, v] of Object.entries(data)) {
    if (allowed.has(k) && typeof v === "string") {
      clean[k] = v.trim() || null;
    }
  }

  await prisma.siteSettings.update({
    where: { id: 1 },
    data: clean,
  });
  await logAudit({
    userId: user.id,
    action: "UPDATE_SETTINGS",
    entity: "SiteSettings",
    ipAddress: await getIp(),
  });
  revalidatePath("/", "layout");
  return { ok: true };
}

// --------------------- Leadership ---------------------
export async function updateLeadership(
  data: {
    nameAr: string;
    nameEn: string;
    titleAr: string;
    titleEn: string;
    bioAr?: string;
    bioEn?: string;
    imageUrl?: string;
  },
  csrfToken: string
) {
  const user = await requireAdmin();
  await assertCsrf(csrfToken);

  await prisma.leadership.upsert({
    where: { id: 1 },
    update: {
      nameAr: stripHtml(data.nameAr),
      nameEn: stripHtml(data.nameEn),
      titleAr: stripHtml(data.titleAr),
      titleEn: stripHtml(data.titleEn),
      bioAr: data.bioAr ? sanitizeHtml(data.bioAr) : null,
      bioEn: data.bioEn ? sanitizeHtml(data.bioEn) : null,
      imageUrl: normalizeMediaUrl(data.imageUrl),
    },
    create: {
      nameAr: stripHtml(data.nameAr),
      nameEn: stripHtml(data.nameEn),
      titleAr: stripHtml(data.titleAr),
      titleEn: stripHtml(data.titleEn),
      bioAr: data.bioAr ? sanitizeHtml(data.bioAr) : null,
      bioEn: data.bioEn ? sanitizeHtml(data.bioEn) : null,
      imageUrl: normalizeMediaUrl(data.imageUrl),
    },
  });
  await logAudit({
    userId: user.id,
    action: "UPDATE_LEADERSHIP",
    ipAddress: await getIp(),
  });
  revalidatePath("/leadership");
  return { ok: true };
}

// --------------------- Pages ---------------------
const pageSchema = z.object({
  slug: z.string().min(1).max(120),
  titleAr: z.string().min(1),
  titleEn: z.string().min(1),
  contentAr: z.string(),
  contentEn: z.string(),
  metaDescAr: z.string().optional(),
  metaDescEn: z.string().optional(),
  published: z.boolean(),
  inNav: z.boolean(),
  navOrder: z.number().int(),
});

export async function savePage(
  id: string | null,
  raw: z.infer<typeof pageSchema>,
  csrfToken: string
) {
  const user = await requireAdmin();
  await assertCsrf(csrfToken);
  const data = pageSchema.parse(raw);
  const slug = slugify(data.slug);

  const payload = {
    slug,
    titleAr: stripHtml(data.titleAr),
    titleEn: stripHtml(data.titleEn),
    contentAr: sanitizeHtml(data.contentAr),
    contentEn: sanitizeHtml(data.contentEn),
    metaDescAr: data.metaDescAr ? stripHtml(data.metaDescAr) : null,
    metaDescEn: data.metaDescEn ? stripHtml(data.metaDescEn) : null,
    published: data.published,
    inNav: data.inNav,
    navOrder: data.navOrder,
  };

  if (id) {
    await prisma.page.update({ where: { id }, data: payload });
    await logAudit({
      userId: user.id,
      action: "UPDATE_PAGE",
      entity: "Page",
      entityId: id,
      ipAddress: await getIp(),
    });
  } else {
    const created = await prisma.page.create({ data: payload });
    await logAudit({
      userId: user.id,
      action: "CREATE_PAGE",
      entity: "Page",
      entityId: created.id,
      ipAddress: await getIp(),
    });
  }
  revalidatePath("/", "layout");
  return { ok: true, slug };
}

export async function deletePage(id: string, csrfToken: string) {
  const user = await requireAdmin();
  await assertCsrf(csrfToken);
  await prisma.page.delete({ where: { id } });
  await logAudit({
    userId: user.id,
    action: "DELETE_PAGE",
    entity: "Page",
    entityId: id,
    ipAddress: await getIp(),
  });
  revalidatePath("/", "layout");
  return { ok: true };
}

// --------------------- Navigation ---------------------
export async function saveNavItem(
  id: string | null,
  data: {
    labelAr: string;
    labelEn: string;
    href: string;
    sortOrder: number;
    visible: boolean;
    isExternal: boolean;
  },
  csrfToken: string
) {
  const user = await requireAdmin();
  await assertCsrf(csrfToken);
  const payload = {
    labelAr: stripHtml(data.labelAr),
    labelEn: stripHtml(data.labelEn),
    href: data.href.trim(),
    sortOrder: data.sortOrder,
    visible: data.visible,
    isExternal: data.isExternal,
  };

  if (id) {
    await prisma.navItem.update({ where: { id }, data: payload });
  } else {
    await prisma.navItem.create({ data: payload });
  }
  await logAudit({
    userId: user.id,
    action: id ? "UPDATE_NAV" : "CREATE_NAV",
    entity: "NavItem",
    entityId: id ?? undefined,
    ipAddress: await getIp(),
  });
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function deleteNavItem(id: string, csrfToken: string) {
  const user = await requireAdmin();
  await assertCsrf(csrfToken);
  await prisma.navItem.delete({ where: { id } });
  await logAudit({
    userId: user.id,
    action: "DELETE_NAV",
    entity: "NavItem",
    entityId: id,
    ipAddress: await getIp(),
  });
  revalidatePath("/", "layout");
  return { ok: true };
}

// --------------------- Subsidiaries ---------------------
export async function saveSubsidiary(
  id: string | null,
  raw: {
    slug: string;
    nameAr: string;
    nameEn: string;
    summaryAr?: string;
    summaryEn?: string;
    contentAr?: string;
    contentEn?: string;
    logoUrl?: string;
    websiteUrl?: string;
    published: boolean;
    sortOrder: number;
  },
  csrfToken: string
) {
  const user = await requireAdmin();
  await assertCsrf(csrfToken);
  const slug = slugify(raw.slug);
  const payload = {
    slug,
    nameAr: stripHtml(raw.nameAr),
    nameEn: stripHtml(raw.nameEn),
    summaryAr: raw.summaryAr ? sanitizeHtml(raw.summaryAr) : null,
    summaryEn: raw.summaryEn ? sanitizeHtml(raw.summaryEn) : null,
    contentAr: raw.contentAr ? sanitizeHtml(raw.contentAr) : null,
    contentEn: raw.contentEn ? sanitizeHtml(raw.contentEn) : null,
    logoUrl: normalizeMediaUrl(raw.logoUrl),
    websiteUrl: raw.websiteUrl ?? null,
    published: raw.published,
    sortOrder: raw.sortOrder,
  };

  if (id) {
    await prisma.subsidiary.update({ where: { id }, data: payload });
  } else {
    await prisma.subsidiary.create({ data: payload });
  }
  await logAudit({
    userId: user.id,
    action: id ? "UPDATE_SUBSIDIARY" : "CREATE_SUBSIDIARY",
    entity: "Subsidiary",
    entityId: id ?? slug,
    ipAddress: await getIp(),
  });
  revalidatePath("/subsidiaries");
  return { ok: true, slug };
}

export async function deleteSubsidiary(id: string, csrfToken: string) {
  const user = await requireAdmin();
  await assertCsrf(csrfToken);
  await prisma.subsidiary.delete({ where: { id } });
  await logAudit({
    userId: user.id,
    action: "DELETE_SUBSIDIARY",
    entity: "Subsidiary",
    entityId: id,
    ipAddress: await getIp(),
  });
  revalidatePath("/subsidiaries");
  return { ok: true };
}

// --------------------- Projects ---------------------
export async function saveProject(
  id: string | null,
  raw: {
    slug: string;
    titleAr: string;
    titleEn: string;
    summaryAr?: string;
    summaryEn?: string;
    contentAr?: string;
    contentEn?: string;
    imageUrl?: string;
    statusAr?: string;
    statusEn?: string;
    published: boolean;
    sortOrder: number;
  },
  csrfToken: string
) {
  const user = await requireAdmin();
  await assertCsrf(csrfToken);
  const slug = slugify(raw.slug);
  const payload = {
    slug,
    titleAr: stripHtml(raw.titleAr),
    titleEn: stripHtml(raw.titleEn),
    summaryAr: raw.summaryAr ? sanitizeHtml(raw.summaryAr) : null,
    summaryEn: raw.summaryEn ? sanitizeHtml(raw.summaryEn) : null,
    contentAr: raw.contentAr ? sanitizeHtml(raw.contentAr) : null,
    contentEn: raw.contentEn ? sanitizeHtml(raw.contentEn) : null,
    imageUrl: normalizeMediaUrl(raw.imageUrl),
    statusAr: raw.statusAr ? stripHtml(raw.statusAr) : null,
    statusEn: raw.statusEn ? stripHtml(raw.statusEn) : null,
    published: raw.published,
    sortOrder: raw.sortOrder,
  };

  if (id) {
    await prisma.project.update({ where: { id }, data: payload });
  } else {
    await prisma.project.create({ data: payload });
  }
  await logAudit({
    userId: user.id,
    action: id ? "UPDATE_PROJECT" : "CREATE_PROJECT",
    entity: "Project",
    entityId: id ?? slug,
    ipAddress: await getIp(),
  });
  revalidatePath("/projects");
  return { ok: true, slug };
}

export async function deleteProject(id: string, csrfToken: string) {
  const user = await requireAdmin();
  await assertCsrf(csrfToken);
  await prisma.project.delete({ where: { id } });
  await logAudit({
    userId: user.id,
    action: "DELETE_PROJECT",
    entity: "Project",
    entityId: id,
    ipAddress: await getIp(),
  });
  revalidatePath("/projects");
  return { ok: true };
}

// --------------------- News ---------------------
export async function saveNews(
  id: string | null,
  raw: {
    slug: string;
    titleAr: string;
    titleEn: string;
    excerptAr?: string;
    excerptEn?: string;
    contentAr: string;
    contentEn: string;
    imageUrl?: string;
    published: boolean;
    publishedAt?: string | null;
  },
  csrfToken: string
) {
  const user = await requireAdmin();
  await assertCsrf(csrfToken);
  const slug = slugify(raw.slug);
  const payload = {
    slug,
    titleAr: stripHtml(raw.titleAr),
    titleEn: stripHtml(raw.titleEn),
    excerptAr: raw.excerptAr ? stripHtml(raw.excerptAr) : null,
    excerptEn: raw.excerptEn ? stripHtml(raw.excerptEn) : null,
    contentAr: sanitizeHtml(raw.contentAr),
    contentEn: sanitizeHtml(raw.contentEn),
    imageUrl: normalizeMediaUrl(raw.imageUrl),
    published: raw.published,
    publishedAt: raw.published
      ? raw.publishedAt
        ? new Date(raw.publishedAt)
        : new Date()
      : null,
  };

  if (id) {
    await prisma.newsArticle.update({ where: { id }, data: payload });
  } else {
    await prisma.newsArticle.create({ data: payload });
  }
  await logAudit({
    userId: user.id,
    action: id ? "UPDATE_NEWS" : "CREATE_NEWS",
    entity: "NewsArticle",
    entityId: id ?? slug,
    ipAddress: await getIp(),
  });
  revalidatePath("/news");
  return { ok: true, slug };
}

export async function deleteNews(id: string, csrfToken: string) {
  const user = await requireAdmin();
  await assertCsrf(csrfToken);
  await prisma.newsArticle.delete({ where: { id } });
  await logAudit({
    userId: user.id,
    action: "DELETE_NEWS",
    entity: "NewsArticle",
    entityId: id,
    ipAddress: await getIp(),
  });
  revalidatePath("/news");
  return { ok: true };
}

// --------------------- Contact Messages ---------------------
export async function markMessageRead(id: string, csrfToken: string) {
  const user = await requireAdmin();
  await assertCsrf(csrfToken);
  await prisma.contactMessage.update({
    where: { id },
    data: { read: true },
  });
  return { ok: true };
}

export async function deleteMessage(id: string, csrfToken: string) {
  const user = await requireAdmin();
  await assertCsrf(csrfToken);
  await prisma.contactMessage.delete({ where: { id } });
  await logAudit({
    userId: user.id,
    action: "DELETE_MESSAGE",
    entity: "ContactMessage",
    entityId: id,
    ipAddress: await getIp(),
  });
  return { ok: true };
}

// --------------------- Media ---------------------
export async function listMedia() {
  await requireAdmin();
  
  // إذا كنت تستخدم Vercel Blob، يمكنك جلب الملفات من Blob Store أيضاً.
  // لكننا سنبقي على Prisma Media كسجل للملفات المرفوعة محلياً أو عبر Blob.
  return prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

const UPLOAD_MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "text/plain": "txt",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export async function uploadMedia(formData: FormData, csrfToken: string) {
  const user = await requireAdmin();
  await assertCsrf(csrfToken);

  const file = formData.get("file") as File | null;
  if (!file || !(file instanceof Blob)) {
    return { error: "لا يوجد ملف" };
  }

  const ext = UPLOAD_MIME_EXT[file.type];
  if (!ext) {
    return { error: "نوع الملف غير مدعوم" };
  }
  if (file.size > 15 * 1024 * 1024) {
    return { error: "الملف كبير جدًا (الحد 15MB)" };
  }

  // ✅ استخدام Vercel Blob في جميع البيئات (محلي وإنتاج)
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  
  try {
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: false,
    });

    const media = await prisma.media.create({
      data: {
        filename: blob.pathname,
        url: blob.url,
        mimeType: file.type,
        size: file.size,
      },
    });

    await logAudit({
      userId: user.id,
      action: "UPLOAD_MEDIA",
      entity: "Media",
      entityId: media.id,
      details: blob.url,
      ipAddress: await getIp(),
    });

    return {
      ok: true,
      url: blob.url,
      id: media.id,
      mimeType: file.type,
      isImage: file.type.startsWith("image/"),
    };
  } catch (error) {
    console.error("Upload to Vercel Blob failed:", error);
    return { error: "فشل رفع الملف، تأكد من إعداد متغير البيئة BLOB_READ_WRITE_TOKEN" };
  }
}