"use client";

import { useLocale } from "./LocaleProvider";

export function EmptyState({
  titleAr,
  titleEn,
  descAr,
  descEn,
}: {
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
}) {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  return (
    <div className="rounded-2xl border border-dashed border-[var(--ame-border)] bg-[var(--ame-surface)] px-8 py-16 text-center">
      <p className="text-lg font-medium">{isAr ? titleAr : titleEn}</p>
      <p className="mt-3 text-sm text-[var(--ame-muted)]">
        {isAr ? descAr : descEn}
      </p>
    </div>
  );
}
