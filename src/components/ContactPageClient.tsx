"use client";

import { useLocale } from "./LocaleProvider";
import { pickLocale } from "@/lib/locale";
import { ContactForm } from "./ContactForm";

export function ContactPageClient({
  csrfToken,
  phone,
  email,
  addressAr,
  addressEn,
}: {
  csrfToken: string;
  phone: string | null;
  email: string | null;
  addressAr: string | null;
  addressEn: string | null;
}) {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const address = pickLocale(locale, addressAr, addressEn);

  return (
    <div>
      <h1 className="text-3xl font-bold">{isAr ? "تواصل معنا" : "Contact Us"}</h1>
      <p className="mt-4 text-[var(--ame-muted)]">
        {isAr
          ? "أرسل رسالتك وسيتم حفظها في نظامنا. لا نستخدم بيانات وهمية."
          : "Send your message — it will be saved in our system. We do not use placeholder data."}
      </p>
      <div className="mt-8 grid gap-12 lg:grid-cols-2">
        <div className="space-y-4 text-sm">
          {phone && (
            <p>
              <strong>{isAr ? "الهاتف:" : "Phone:"}</strong>{" "}
              <a href={`tel:${phone}`} className="text-[var(--ame-accent)]">
                {phone}
              </a>
            </p>
          )}
          {email && (
            <p>
              <strong>{isAr ? "البريد:" : "Email:"}</strong>{" "}
              <a href={`mailto:${email}`} className="text-[var(--ame-accent)]">
                {email}
              </a>
            </p>
          )}
          {address ? (
            <p>
              <strong>{isAr ? "العنوان:" : "Address:"}</strong> {address}
            </p>
          ) : (
            <p className="text-[var(--ame-muted)]">
              {isAr ? "العنوان: غير متوفر حاليًا" : "Address: not available at this time"}
            </p>
          )}
        </div>
        <ContactForm csrfToken={csrfToken} />
      </div>
    </div>
  );
}
