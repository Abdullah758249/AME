import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { LeadershipAdminForm } from "@/components/admin/LeadershipAdminForm";

export default async function AdminLeadershipPage() {
  const leader = await prisma.leadership.findFirst({ where: { id: 1 } });
  return (
    <AdminShell title="الإدارة والقيادة">
      <LeadershipAdminForm leader={leader} />
    </AdminShell>
  );
}
