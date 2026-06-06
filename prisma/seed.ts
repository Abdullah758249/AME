import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "abdullahemam48@gmail.com";

  // التحقق من وجود مستخدم بنفس البريد الإلكتروني
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  let finalPassword: string;
  let tempPassword: string | null = null;

  if (!existingAdmin) {
    // إنشاء كلمة مرور عشوائية قوية (12 حرفًا)
    tempPassword = crypto.randomBytes(8).toString("hex"); // 16 حرفًا عشوائيًا
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash: hashedPassword,
        name: "عبدالله محمد إمام",
      },
    });

    finalPassword = tempPassword;
    console.log("====================================");
    console.log(`🔐 تم إنشاء حساب المسؤول لأول مرة.`);
    console.log(`📧 البريد: ${adminEmail}`);
    console.log(`🔑 كلمة المرور المؤقتة: ${tempPassword}`);
    console.log(`⚠️  يرجى تغييرها فور تسجيل الدخول!`);
    console.log("====================================");
  } else {
    // إذا كان الحساب موجودًا، لا نغير كلمة المرور (نحافظ على الأمان)
    // يمكن تفعيل السطر التالي إذا أردت تحديث كلمة المرور من متغير بيئة
    // const envPassword = process.env.ADMIN_PASSWORD;
    // if (envPassword) {
    //   const newHash = await bcrypt.hash(envPassword, 10);
    //   await prisma.adminUser.update({
    //     where: { email: adminEmail },
    //     data: { passwordHash: newHash },
    //   });
    //   console.log("تم تحديث كلمة مرور المسؤول من متغير البيئة.");
    // }
    console.log(`✅ المسؤول موجود بالفعل. لم يتم تغيير كلمة المرور.`);
    finalPassword = "(محفوظة بالفعل)";
  }

  // باقي الإعدادات (siteSettings, leadership, navItems) تبقى كما هي
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      companyNameAr: "AME",
      companyNameEn: "AME",
      taglineAr: "شركة قابضة واستثمارية — مرحلة التأسيس",
      taglineEn: "Holding & Investment Company — Founding Stage",
      phone: "01270969315",
      email: "abdullahemam48@gmail.com",
      aboutAr:
        "AME هي شركة قابضة واستثمارية في مرحلة التأسيس. الهدف منها إنشاء وامتلاك وتطوير شركات ومشاريع في مجالات متعددة مستقبلاً. في الوقت الحالي لا توجد شركات تابعة رسمية مضافة للنظام إلا إذا تم إضافتها لاحقًا من لوحة الإدارة.",
      aboutEn:
        "AME is a holding and investment company in its founding stage. Its purpose is to establish, own, and develop companies and projects across multiple sectors in the future. At present, no official subsidiaries are registered in the system unless added later via the admin panel.",
      visionAr:
        "بناء مجموعة استثمارية قابلة للتوسع تُنشئ وتُطوّر أعمالًا مستدامة عبر قطاعات متعددة — مع الشفافية والحوكمة منذ البداية.",
      visionEn:
        "Build an expandable investment group that creates and develops sustainable businesses across sectors — with transparency and governance from day one.",
      missionAr:
        "تأسيس وإدارة منصة قابضة تمكّن من إطلاق وتطوير المشاريع والشركات التابعة عند الجاهزية، دون ادعاءات أو بيانات غير موثقة.",
      missionEn:
        "Establish and operate a holding platform that enables launching and developing subsidiaries and projects when ready — without unverified claims or data.",
      valuesAr:
        "الشفافية — الصدق — عدم نشر بيانات غير موجودة — الحوكمة — الجودة — الاستدامة طويلة الأمد",
      valuesEn:
        "Transparency — Integrity — No unverified data — Governance — Quality — Long-term sustainability",
      homeIntroAr:
        "مرحبًا بكم في AME. نحن في مرحلة التأسيس ونعمل على بناء البنية التحتية للمجموعة. المحتوى والشركات التابعة والمشاريع والأخبار تُدار من لوحة الإدارة وتظهر هنا فقط عند توفرها فعليًا.",
      homeIntroEn:
        "Welcome to AME. We are in our founding stage and building the group's foundation. Subsidiaries, projects, news, and content are managed via the admin panel and appear here only when actually available.",
      metaDescriptionAr:
        "AME — شركة قابضة واستثمارية في مرحلة التأسيس",
      metaDescriptionEn:
        "AME — Holding & investment company in founding stage",
    },
  });

  await prisma.leadership.upsert({
    where: { id: 1 },
    update: {},
    create: {
      nameAr: "عبدالله محمد إمام",
      nameEn: "Abdullah Mohamed Imam",
      titleAr:
        "المؤسس، الرئيس التنفيذي (CEO)، المدير العام، والمساهم الأكبر في AME",
      titleEn:
        "Founder, Chief Executive Officer (CEO), Managing Director and Majority Shareholder of AME",
      bioAr:
        "قيادة الشركة في مرحلة التأسيس وبناء الإطار المؤسسي للمجموعة القابضة.",
      bioEn:
        "Leading the company through its founding stage and building the institutional framework of the holding group.",
      published: true,
      sortOrder: 0,
    },
  });

  const defaultNav = [
    { labelAr: "الرئيسية", labelEn: "Home", href: "/", sortOrder: 0 },
    { labelAr: "من نحن", labelEn: "About", href: "/about", sortOrder: 1 },
    { labelAr: "الرؤية", labelEn: "Vision", href: "/vision", sortOrder: 2 },
    { labelAr: "الرسالة", labelEn: "Mission", href: "/mission", sortOrder: 3 },
    { labelAr: "القيم", labelEn: "Values", href: "/values", sortOrder: 4 },
    {
      labelAr: "الإدارة",
      labelEn: "Leadership",
      href: "/leadership",
      sortOrder: 5,
    },
    {
      labelAr: "الشركات التابعة",
      labelEn: "Subsidiaries",
      href: "/subsidiaries",
      sortOrder: 6,
    },
    { labelAr: "المشاريع", labelEn: "Projects", href: "/projects", sortOrder: 7 },
    { labelAr: "الأخبار", labelEn: "News", href: "/news", sortOrder: 8 },
    { labelAr: "تواصل", labelEn: "Contact", href: "/contact", sortOrder: 9 },
  ];

  const navCount = await prisma.navItem.count();
  if (navCount === 0) {
    await prisma.navItem.createMany({ data: defaultNav });
  }

  console.log("✅ Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("❌ خطأ في seeding:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());