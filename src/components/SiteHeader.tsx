"use client";

import Link from "next/link";
import { SafeImage } from "./SafeImage";
import { isDisplayableMediaUrl } from "@/lib/media-url";
import { useState } from "react";
import { Menu, X, Sun, Moon, Search } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useLocale } from "./LocaleProvider";
import { SearchDialog } from "./SearchDialog";

type NavItem = {
  labelAr: string;
  labelEn: string;
  href: string;
  isExternal: boolean;
};

export function SiteHeader({
  logoUrl,
  companyName,
  navItems,
}: {
  logoUrl: string | null;
  companyName: string;
  navItems: NavItem[];
}) {
  const { theme, toggle } = useTheme();
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isAr = locale === "ar";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--ame-border)] bg-[var(--ame-surface)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
          {isDisplayableMediaUrl(logoUrl) ? (
            <SafeImage src={logoUrl} alt={companyName} width={40} height={40} className="h-10 w-10 object-contain" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--ame-accent)] text-sm font-bold text-white">
              AME
            </span>
          )}
          <span>{companyName}</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              target={item.isExternal ? "_blank" : undefined}
              rel={item.isExternal ? "noopener noreferrer" : undefined}
              className="text-sm text-[var(--ame-muted)] transition hover:text-[var(--ame-fg)]"
            >
              {isAr ? item.labelAr : item.labelEn}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="rounded-lg p-2 hover:bg-[var(--ame-border)]"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setLocale(isAr ? "en" : "ar")}
            className="rounded-lg px-2 py-1 text-xs font-medium hover:bg-[var(--ame-border)]"
          >
            {isAr ? "EN" : "عربي"}
          </button>
          <button
            type="button"
            onClick={toggle}
            className="rounded-lg p-2 hover:bg-[var(--ame-border)]"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <button
            type="button"
            className="rounded-lg p-2 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-[var(--ame-border)] px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm text-[var(--ame-muted)]"
              >
                {isAr ? item.labelAr : item.labelEn}
              </Link>
            ))}
          </div>
        </nav>
      )}

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
