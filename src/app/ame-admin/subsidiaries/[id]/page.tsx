import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { SubsidiaryEditor } from "@/components/admin/SubsidiaryEditor";
import { Suspense } from "react";

export default async function EditSubsidiary({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id || typeof id !== "string") {
    notFound();
  }

  const item = await prisma.subsidiary.findUnique({
    where: { id },
  });

  if (!item) notFound();

  return (
    <AdminShell title={item.nameAr}>
      <Suspense fallback={<div className="p-4 text-center">جاري تحميل المحرر...</div>}>
        <SubsidiaryEditor item={item} />
      </Suspense>
    </AdminShell>
  );
}