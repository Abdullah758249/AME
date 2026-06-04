"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from "./LocaleProvider";
import { pickLocale } from "@/lib/locale";
import type { SiteSettings } from "@prisma/client";

export function HomeHero({
  settings,
  hasNews,
  hasSubsidiaries,
  hasProjects,
}: {
  settings: SiteSettings;
  hasNews: boolean;
  hasSubsidiaries: boolean;
  hasProjects: boolean;
}) {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  const tagline = pickLocale(locale, settings.taglineAr, settings.taglineEn);
  const intro = pickLocale(locale, settings.homeIntroAr, settings.homeIntroEn);

  return (
    <div>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-[var(--ame-border)] bg-gradient-to-br from-[var(--ame-surface)] to-[var(--ame-bg)] px-8 py-20 md:px-16 md:py-28"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--ame-accent)_0%,transparent_50%)] opacity-[0.07]" />
        <p className="text-sm font-medium uppercase tracking-widest text-[var(--ame-gold)]">
          {isAr ? "مرحلة التأسيس" : "Founding Stage"}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
          {pickLocale(locale, settings.companyNameAr, settings.companyNameEn)}
        </h1>
        {tagline && (
          <p className="mt-6 max-w-2xl text-lg text-[var(--ame-muted)]">{tagline}</p>
        )}
        {intro && (
          <p className="mt-4 max-w-2xl text-[var(--ame-muted)]">{intro}</p>
        )}
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/about"
            className="rounded-lg bg-[var(--ame-accent)] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            {isAr ? "من نحن" : "About us"}
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border border-[var(--ame-border)] px-6 py-3 text-sm font-medium transition hover:bg-[var(--ame-border)]"
          >
            {isAr ? "تواصل" : "Contact"}
          </Link>
        </div>
      </motion.section>

      <section className="mt-16 grid gap-6 md:grid-cols-3">
        <StatusCard
          title={isAr ? "الشركات التابعة" : "Subsidiaries"}
          available={hasSubsidiaries}
          href="/subsidiaries"
          isAr={isAr}
        />
        <StatusCard
          title={isAr ? "المشاريع" : "Projects"}
          available={hasProjects}
          href="/projects"
          isAr={isAr}
        />
        <StatusCard
          title={isAr ? "الأخبار" : "News"}
          available={hasNews}
          href="/news"
          isAr={isAr}
        />
      </section>
    </div>
  );
}

function StatusCard({
  title,
  available,
  href,
  isAr,
}: {
  title: string;
  available: boolean;
  href: string;
  isAr: boolean;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-[var(--ame-border)] bg-[var(--ame-surface)] p-6 transition hover:border-[var(--ame-accent)]"
    >
      <h2 className="font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-[var(--ame-muted)]">
        {available
          ? isAr
            ? "محتوى متوفر — اعرض القائمة"
            : "Content available — view list"
          : isAr
            ? "لا توجد بيانات منشورة حاليًا"
            : "No published data at this time"}
      </p>
    </Link>
  );
}
