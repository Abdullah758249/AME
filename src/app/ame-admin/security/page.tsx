import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminSession } from "@/lib/session";
import { SecurityClient } from "@/components/admin/SecurityClient";

export default async function AdminSecurityPage() {
  const user = await getAdminSession();
  return (
    <AdminShell title="الأمان">
      <SecurityClient totpEnabled={user?.totpEnabled ?? false} />
    </AdminShell>
  );
}
