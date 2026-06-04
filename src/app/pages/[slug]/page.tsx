import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ContentPage } from "@/components/ContentPage";

export default async function CmsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await prisma.page.findFirst({
    where: { slug, published: true },
  });
  if (!page) notFound();

  return (
    <ContentPage
      titleAr={page.titleAr}
      titleEn={page.titleEn}
      htmlAr={page.contentAr}
      htmlEn={page.contentEn}
    />
  );
}
