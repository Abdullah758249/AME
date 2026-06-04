import { AdminShell } from "@/components/admin/AdminShell";
import { getSiteSettings } from "@/lib/settings";
import { AdminSettingsForm } from "@/components/admin/AdminSettingsForm";
import { LogoUpload } from "@/components/admin/LogoUpload";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();
  return (
    <AdminShell title="إعدادات الموقع">
      <LogoUpload currentLogo={settings.logoUrl} />
      <AdminSettingsForm settings={settings} />
    </AdminShell>
  );
}
