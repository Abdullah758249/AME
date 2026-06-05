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

  // التحقق من صحة المعرف
  if (!id || typeof id !== "string") {
    notFound();
  }

  // جلب البيانات مع معالجة الأخطاء
  const item = await prisma.subsidiary
    .findUnique({
      where: { id },
      // تحديد الحقول المطلوبة فقط لتحسين الأداء
      select: {
        id: true,
        slug: true,
        nameAr: true,
        nameEn: true,
        summaryAr: true,
        summaryEn: true,
        contentAr: true,
        contentEn: true,
        logoUrl: true,
        websiteUrl: true,
        published: true,
        sortOrder: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    .catch((error) => {
      console.error("Failed to fetch subsidiary:", error);
      return null;
    });

  if (!item) notFound();

  // تحويل التواريخ إلى سلاسل نصية لتجنب أخطاء serialization مع Next.js
  const serializedItem = {
    ...item,
    createdAt: item.createdAt?.toISOString() ?? null,
    updatedAt: item.updatedAt?.toISOString() ?? null,
  };

  return (
    <AdminShell title={serializedItem.nameAr}>
      <Suspense fallback={<div className="p-4 text-center">جاري تحميل المحرر...</div>}>
        <SubsidiaryEditor item={serializedItem} />
      </Suspense>
    </AdminShell>
  );
}