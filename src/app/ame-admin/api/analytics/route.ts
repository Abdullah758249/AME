import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { subDays, subWeeks, subMonths } from "date-fns";

export async function GET(request: NextRequest) {
  const period = request.nextUrl.searchParams.get("period") || "all";
  let startDate: Date | null = null;
  const now = new Date();

  if (period === "today") startDate = subDays(now, 1);
  else if (period === "week") startDate = subWeeks(now, 1);
  else if (period === "month") startDate = subMonths(now, 1);

  const where = startDate ? { createdAt: { gte: startDate } } : {};

  const [todayCount, weekCount, monthCount, totalCount] = await Promise.all([
    prisma.visit.count({ where: { createdAt: { gte: subDays(now, 1) } } }),
    prisma.visit.count({ where: { createdAt: { gte: subWeeks(now, 1) } } }),
    prisma.visit.count({ where: { createdAt: { gte: subMonths(now, 1) } } }),
    prisma.visit.count(),
  ]);

  const topPages = await prisma.visit.groupBy({
    by: ["path"],
    where,
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 10,
  });

  const sources = await prisma.visit.groupBy({
    by: ["source"],
    where,
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 10,
  });

  const countries = await prisma.visit.groupBy({
    by: ["country"],
    where,
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 20,
  });

  // إذا كانت حقول browser و os موجودة في السكيما
  let browsers: any[] = [];
  let os: any[] = [];
  if ("browser" in prisma.visit.fields) {
    browsers = await prisma.visit.groupBy({
      by: ["browser"],
      where,
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    });
  }
  if ("os" in prisma.visit.fields) {
    os = await prisma.visit.groupBy({
      by: ["os"],
      where,
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    });
  }

  return NextResponse.json({
    today: todayCount,
    week: weekCount,
    month: monthCount,
    total: totalCount,
    topPages: topPages.map((p) => ({ path: p.path, count: p._count.id })),
    sources: sources.map((s) => ({ source: s.source, count: s._count.id })),
    countries: countries.map((c) => ({ country: c.country || "غير معروف", count: c._count.id })),
    browsers: browsers.map((b) => ({ browser: b.browser, count: b._count.id })),
    os: os.map((o) => ({ os: o.os, count: o._count.id })),
  });
}