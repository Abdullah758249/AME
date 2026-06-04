import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { NewsEditor } from "@/components/admin/NewsEditor";

export default async function EditNews({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.newsArticle.findUnique({ where: { id } });
  if (!item) notFound();
  return (
    <AdminShell title={item.titleAr}>
      <NewsEditor item={item} />
    </AdminShell>
  );
}
