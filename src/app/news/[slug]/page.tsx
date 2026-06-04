import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EntityDetail } from "@/components/EntityDetail";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await prisma.newsArticle.findFirst({
    where: { slug, published: true },
  });
  if (!item) notFound();

  return (
    <EntityDetail
      titleAr={item.titleAr}
      titleEn={item.titleEn}
      summaryAr={item.excerptAr}
      summaryEn={item.excerptEn}
      contentAr={item.contentAr}
      contentEn={item.contentEn}
      imageUrl={item.imageUrl}
      date={item.publishedAt}
    />
  );
}
