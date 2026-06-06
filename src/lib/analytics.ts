import { prisma } from "./prisma";
// 👇 التعديل هنا: إضافة الأقواس المجعدة حول الاستيراد
import { UAParser } from 'ua-parser-js'; 

export function parseUserAgent(ua: string) {
  // الآن سيعمل هذا السطر بشكل سليم تماماً دون أخطاء
  const parser = new UAParser(ua); 
  return {
    browser: parser.getBrowser().name || 'غير معروف',
    os: parser.getOS().name || 'غير معروف',
  };
}

// بقية الكود الخاص بك كما هو...
// أضف هذه الحقول في model Visit في schema.prisma
// browser String?
// os String?



function startOfDay(d = new Date()): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfWeek(d = new Date()): Date {
  const x = new Date(d);
  const day = x.getDay();
  const diff = day === 0 ? 6 : day - 1;
  x.setDate(x.getDate() - diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

function startOfMonth(d = new Date()): Date {
  const x = new Date(d);
  x.setDate(1);
  x.setHours(0, 0, 0, 0);
  return x;
}

export async function recordVisit(data: {
  path: string;
  referrer?: string;
  source?: string;
  country?: string;
  userAgent?: string;
  sessionId?: string;
}): Promise<void> {
  await prisma.pageVisit.create({ data });
}

export async function getAnalyticsSummary() {
  const now = new Date();
  const dayStart = startOfDay(now);
  const weekStart = startOfWeek(now);
  const monthStart = startOfMonth(now);

  const [today, week, month, total, topPages, sources, countries] =
    await Promise.all([
      prisma.pageVisit.count({ where: { createdAt: { gte: dayStart } } }),
      prisma.pageVisit.count({ where: { createdAt: { gte: weekStart } } }),
      prisma.pageVisit.count({ where: { createdAt: { gte: monthStart } } }),
      prisma.pageVisit.count(),
      prisma.pageVisit.groupBy({
        by: ["path"],
        _count: { path: true },
        orderBy: { _count: { path: "desc" } },
        take: 15,
      }),
      prisma.pageVisit.groupBy({
        by: ["source"],
        _count: { source: true },
        where: { source: { not: null } },
        orderBy: { _count: { source: "desc" } },
        take: 15,
      }),
      prisma.pageVisit.groupBy({
        by: ["country"],
        _count: { country: true },
        where: { country: { not: null } },
        orderBy: { _count: { country: "desc" } },
        take: 20,
      }),
    ]);

  return {
    today,
    week,
    month,
    total,
    topPages: topPages.map((p) => ({
      path: p.path,
      count: p._count.path,
    })),
    sources: sources.map((s) => ({
      source: s.source ?? "unknown",
      count: s._count.source,
    })),
    countries: countries.map((c) => ({
      country: c.country ?? "unknown",
      count: c._count.country,
    })),
  };
}

export function parseReferrerSource(
  referrer: string | null,
  searchParams?: URLSearchParams
): string {
  const utm = searchParams?.get("utm_source");
  if (utm) return `utm:${utm}`;
  if (!referrer) return "direct";
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    if (host.includes("google")) return "google";
    if (host.includes("bing")) return "bing";
    if (host.includes("facebook") || host.includes("fb.")) return "facebook";
    if (host.includes("twitter") || host.includes("x.com")) return "twitter";
    if (host.includes("linkedin")) return "linkedin";
    return host;
  } catch {
    return "referral";
  }
}
