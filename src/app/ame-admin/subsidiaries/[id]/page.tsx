import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { SubsidiaryEditor } from "@/components/admin/SubsidiaryEditor";

export default async function EditSubsidiary({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await prisma.subsidiary.findUnique({ where: { id } });
  if (!item) notFound();
  return (
    <AdminShell title={item.nameAr}>
      <SubsidiaryEditor item={item} />
    </AdminShell>
  );
}
