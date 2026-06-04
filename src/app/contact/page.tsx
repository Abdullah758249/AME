import { getSiteSettings } from "@/lib/settings";
import { getCsrfToken } from "@/lib/csrf";
import { ContactPageClient } from "@/components/ContactPageClient";

export default async function ContactPage() {
  const [settings, csrfToken] = await Promise.all([
    getSiteSettings(),
    getCsrfToken(),
  ]);

  return (
    <ContactPageClient
      csrfToken={csrfToken}
      phone={settings.phone}
      email={settings.email}
      addressAr={settings.addressAr}
      addressEn={settings.addressEn}
    />
  );
}
