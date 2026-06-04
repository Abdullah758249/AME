import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { CrudTable } from "@/components/admin/CrudTable";

export default async function AdminNewsPage() {
  const items = await prisma.newsArticle.findMany({ orderBy: { updatedAt: "desc" } });
  return (
    <AdminShell title="الأخبار">
      <CrudTable
        basePath="/ame-admin/news"
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
