export const preferredRegion = 'fra1'; // لتجبر Vercel على تشغيل الكود في سيرفرات ألمانيا بجانب الـ Middleware
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { PageEditor } from "@/components/admin/PageEditor";

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) notFound();
  return (
    <AdminShell title={`تعديل: ${page.titleAr}`}>
      <PageEditor page={page} />
    </AdminShell>
  );
}
