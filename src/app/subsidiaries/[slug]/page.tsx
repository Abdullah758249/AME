import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EntityDetail } from "@/components/EntityDetail";

export default async function SubsidiaryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await prisma.subsidiary.findFirst({
    where: { slug, published: true },
  });
  if (!item) notFound();

  return (
    <EntityDetail
      titleAr={item.nameAr}
      titleEn={item.nameEn}
      summaryAr={item.summaryAr}
      summaryEn={item.summaryEn}
      contentAr={item.contentAr}
      contentEn={item.contentEn}
      imageUrl={item.logoUrl}
      websiteUrl={item.websiteUrl}
    />
  );
}
