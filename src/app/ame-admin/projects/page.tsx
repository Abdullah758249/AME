import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { CrudTable } from "@/components/admin/CrudTable";

export default async function AdminProjectsPage() {
  const items = await prisma.project.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <AdminShell title="المشاريع">
      <CrudTable
        basePath="/ame-admin/projects"
        items={items}
        columns={[
          { key: "slug", label: "المعرّف" },
          { key: "titleAr", label: "العنوان" },
          { key: "published", label: "منشور" },
        ]}
      />
    </AdminShell>
  );
}
