import { AdminShell } from "@/components/admin/AdminShell";
import { NewsEditor } from "@/components/admin/NewsEditor";

export default function NewNews() {
  return (
    <AdminShell title="خبر جديد">
      <NewsEditor />
    </AdminShell>
  );
}
