import { AdminShell } from "@/components/admin/AdminShell";
import { ProjectEditor } from "@/components/admin/ProjectEditor";

export default function NewProject() {
  return (
    <AdminShell title="مشروع جديد">
      <ProjectEditor />
    </AdminShell>
  );
}
