import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { NavAdminClient } from "@/components/admin/NavAdminClient";

export default async function AdminNavPage() {
  const items = await prisma.navItem.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <AdminShell title="القوائم والتنقل">
      <NavAdminClient items={items} />
    </AdminShell>
  );
}
