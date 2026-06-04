import { AdminShell } from "@/components/admin/AdminShell";
import { PageEditor } from "@/components/admin/PageEditor";

export default function NewPage() {
  return (
    <AdminShell title="صفحة جديدة">
      <PageEditor />
    </AdminShell>
  );
}
