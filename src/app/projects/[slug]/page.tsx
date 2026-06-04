import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EntityDetail } from "@/components/EntityDetail";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await prisma.project.findFirst({
    where: { slug, published: true },
  });
  if (!item) notFound();

  return (
    <EntityDetail
      titleAr={item.titleAr}
      titleEn={item.titleEn}
      summaryAr={item.summaryAr}
      summaryEn={item.summaryEn}
      contentAr={item.contentAr}
      contentEn={item.contentEn}
      imageUrl={item.imageUrl}
      statusAr={item.statusAr}
      statusEn={item.statusEn}
    />
  );
}
