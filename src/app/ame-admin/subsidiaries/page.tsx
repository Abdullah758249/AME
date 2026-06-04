import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { CrudTable } from "@/components/admin/CrudTable";

export default async function AdminSubsidiariesPage() {
  const items = await prisma.subsidiary.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <AdminShell title="الشركات التابعة">
      <CrudTable
        basePath="/ame-admin/subsidiaries"
        items={items}
        columns={[
          { key: "slug", label: "المعرّف" },
          { key: "nameAr", label: "الاسم" },
          { key: "published", label: "منشور" },
        ]}
      />
    </AdminShell>
  );
}
