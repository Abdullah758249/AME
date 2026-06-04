import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  const locale = request.nextUrl.searchParams.get("locale") ?? "ar";

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const term = q.slice(0, 100);

  const [pages, subsidiaries, projects, news] = await Promise.all([
    prisma.page.findMany({
      where: {
        published: true,
        OR: [
          { titleAr: { contains: term } },
          { titleEn: { contains: term } },
          { contentAr: { contains: term } },
          { contentEn: { contains: term } },
        ],
      },
      take: 10,
      select: { slug: true, titleAr: true, titleEn: true },
    }),
    prisma.subsidiary.findMany({
      where: {
        published: true,
        OR: [
          { nameAr: { contains: term } },
          { nameEn: { contains: term } },
          { summaryAr: { contains: term } },
          { summaryEn: { contains: term } },
        ],
      },
      take: 10,
      select: { slug: true, nameAr: true, nameEn: true },
    }),
    prisma.project.findMany({
      where: {
        published: true,
        OR: [
          { titleAr: { contains: term } },
          { titleEn: { contains: term } },
          { summaryAr: { contains: term } },
          { summaryEn: { contains: term } },
        ],
      },
      take: 10,
      select: { slug: true, titleAr: true, titleEn: true },
    }),
    prisma.newsArticle.findMany({
      where: {
        published: true,
        OR: [
          { titleAr: { contains: term } },
          { titleEn: { contains: term } },
          { excerptAr: { contains: term } },
          { excerptEn: { contains: term } },
        ],
      },
      take: 10,
      select: { slug: true, titleAr: true, titleEn: true },
    }),
  ]);

  const isAr = locale === "ar";
  const results = [
    ...pages.map((p) => ({
      type: "page" as const,
      href: `/pages/${p.slug}`,
      title: isAr ? p.titleAr : p.titleEn,
    })),
    ...subsidiaries.map((s) => ({
      type: "subsidiary" as const,
      href: `/subsidiaries/${s.slug}`,
      title: isAr ? s.nameAr : s.nameEn,
    })),
    ...projects.map((p) => ({
      type: "project" as const,
      href: `/projects/${p.slug}`,
      title: isAr ? p.titleAr : p.titleEn,
    })),
    ...news.map((n) => ({
      type: "news" as const,
      href: `/news/${n.slug}`,
      title: isAr ? n.titleAr : n.titleEn,
    })),
  ];

  return NextResponse.json({ results });
}
