"use client";

import Link from "next/link";
import { useLocale } from "./LocaleProvider";
import { pickLocale } from "@/lib/locale";
import { EmptyState } from "./EmptyState";

type Item = {
  slug: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string | null;
  summaryEn: string | null;
  statusAr: string | null;
  statusEn: string | null;
};

export function ProjectsList({ items }: { items: Item[] }) {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  if (items.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold">{isAr ? "المشاريع" : "Projects"}</h1>
        <div className="mt-8">
          <EmptyState
            titleAr="لا توجد مشاريع منشورة"
            titleEn="No published projects"
            descAr="لم يُضف أي مشروع بعد. عند إضافته من لوحة الإدارة سيظهر هنا."
            descEn="No projects have been added yet. When added via the admin panel, they will appear here."
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">{isAr ? "المشاريع" : "Projects"}</h1>
      <ul className="mt-10 space-y-4">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/projects/${item.slug}`}
              className="block rounded-2xl border border-[var(--ame-border)] bg-[var(--ame-surface)] p-6 transition hover:border-[var(--ame-accent)]"
            >
              <h2 className="font-semibold">{pickLocale(locale, item.titleAr, item.titleEn)}</h2>
              {(item.statusAr || item.statusEn) && (
                <span className="mt-2 inline-block text-xs text-[var(--ame-gold)]">
                  {pickLocale(locale, item.statusAr, item.statusEn)}
                </span>
              )}
              {(item.summaryAr || item.summaryEn) && (
                <p className="mt-2 text-sm text-[var(--ame-muted)]">
                  {pickLocale(locale, item.summaryAr, item.summaryEn)}
                </p>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
