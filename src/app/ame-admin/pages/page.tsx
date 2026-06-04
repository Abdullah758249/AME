import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { CrudTable } from "@/components/admin/CrudTable";

export default async function AdminPagesList() {
  const pages = await prisma.page.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <AdminShell title="صفحات CMS">
      <CrudTable
        basePath="/ame-admin/pages"
        items={pages}
        columns={[
          { key: "slug", label: "المعرّف" },
          { key: "titleAr", label: "العنوان" },
          { key: "published", label: "منشور" },
        ]}
      />
    </AdminShell>
  );
}
