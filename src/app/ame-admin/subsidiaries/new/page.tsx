import { AdminShell } from "@/components/admin/AdminShell";
import { SubsidiaryEditor } from "@/components/admin/SubsidiaryEditor";

export default function NewSubsidiary() {
  return (
    <AdminShell title="شركة تابعة جديدة">
      <SubsidiaryEditor />
    </AdminShell>
  );
}
