"use client";

import Link from "next/link";
import { useLocale } from "./LocaleProvider";

export function SiteFooter({
  companyName,
  email,
  phone,
}: {
  companyName: string;
  email: string | null;
  phone: string | null;
}) {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--ame-border)] bg-[var(--ame-surface)]">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div>
            <p className="text-lg font-semibold">{companyName}</p>
            <p className="mt-2 max-w-md text-sm text-[var(--ame-muted)]">
              {isAr
                ? "شركة قابضة واستثمارية في مرحلة التأسيس."
                : "Holding & investment company in founding stage."}
            </p>
          </div>
          <div className="text-sm text-[var(--ame-muted)]">
            {phone && (
              <p>
                <span className="font-medium text-[var(--ame-fg)]">
                  {isAr ? "الهاتف: " : "Phone: "}
                </span>
                <a href={`tel:${phone}`} className="hover:underline">
                  {phone}
                </a>
              </p>
            )}
            {email && (
              <p className="mt-2">
                <span className="font-medium text-[var(--ame-fg)]">
                  {isAr ? "البريد: " : "Email: "}
                </span>
                <a href={`mailto:${email}`} className="hover:underline">
                  {email}
                </a>
              </p>
            )}
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-[var(--ame-border)] pt-8 text-xs text-[var(--ame-muted)] sm:flex-row sm:justify-between">
          <p>
            © {year} {companyName}. {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
          </p>
          <Link href="/contact" className="hover:underline">
            {isAr ? "تواصل معنا" : "Contact us"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
