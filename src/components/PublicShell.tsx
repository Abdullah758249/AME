"use client";

import { useEffect, type ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { useLocale } from "./LocaleProvider";
import type { SiteSettings } from "@prisma/client";

type Nav = {
  labelAr: string;
  labelEn: string;
  href: string;
  isExternal: boolean;
};

export function PublicShell({
  children,
  settings,
  navItems,
}: {
  children: ReactNode;
  settings: SiteSettings;
  navItems: Nav[];
}) {
  const { locale, setLocale } = useLocale();

  useEffect(() => {
    const stored = localStorage.getItem("ame-locale") as "ar" | "en" | null;
    if (stored) setLocale(stored);
    else setLocale("ar");
  }, [setLocale]);

  const companyName =
    locale === "ar" ? settings.companyNameAr : settings.companyNameEn;

  return (
    <>
      <SiteHeader
        logoUrl={settings.logoUrl}
        companyName={companyName}
        navItems={navItems}
      />
      <main className="mx-auto min-h-[60vh] max-w-6xl px-4 py-12">{children}</main>
      <SiteFooter
        companyName={companyName}
        email={settings.email}
        phone={settings.phone}
      />
    </>
  );
}
