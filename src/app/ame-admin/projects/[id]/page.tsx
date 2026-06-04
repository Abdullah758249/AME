import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { ProjectEditor } from "@/components/admin/ProjectEditor";

export default async function EditProject({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.project.findUnique({ where: { id } });
  if (!item) notFound();
  return (
    <AdminShell title={item.titleAr}>
      <ProjectEditor item={item} />
    </AdminShell>
  );
}
