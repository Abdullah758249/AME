"use client";

import Link from "next/link";
import { SafeImage } from "./SafeImage";
import { isDisplayableMediaUrl } from "@/lib/media-url";
import { useLocale } from "./LocaleProvider";
import { pickLocale } from "@/lib/locale";
import { EmptyState } from "./EmptyState";

type Item = {
  slug: string;
  nameAr: string;
  nameEn: string;
  summaryAr: string | null;
  summaryEn: string | null;
  logoUrl: string | null;
};

export function SubsidiariesList({ items }: { items: Item[] }) {
  const { locale } = useLocale();
  const isAr = locale === "ar";

  if (items.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold">{isAr ? "الشركات التابعة" : "Subsidiaries"}</h1>
        <div className="mt-8">
          <EmptyState
            titleAr="لا توجد شركات تابعة منشورة"
            titleEn="No published subsidiaries"
            descAr="لم تُضف شركات تابعة رسمية بعد. عند إضافتها من لوحة الإدارة ستظهر هنا تلقائيًا."
            descEn="No official subsidiaries have been added yet. When added via the admin panel, they will appear here automatically."
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">{isAr ? "الشركات التابعة" : "Subsidiaries"}</h1>
      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/subsidiaries/${item.slug}`}
              className="flex gap-4 rounded-2xl border border-[var(--ame-border)] bg-[var(--ame-surface)] p-6 transition hover:border-[var(--ame-accent)]"
            >
              {isDisplayableMediaUrl(item.logoUrl) && (
                <SafeImage src={item.logoUrl} alt="" width={64} height={64} className="h-16 w-16 object-contain" />
              )}
              <div>
                <h2 className="font-semibold">{pickLocale(locale, item.nameAr, item.nameEn)}</h2>
                {(item.summaryAr || item.summaryEn) && (
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--ame-muted)]">
                    {pickLocale(locale, item.summaryAr, item.summaryEn)}
                  </p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
