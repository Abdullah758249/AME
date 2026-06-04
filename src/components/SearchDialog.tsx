"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "./LocaleProvider";

export function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { locale } = useLocale();
  const [q, setQ] = useState("");
  const [results, setResults] = useState<{ href: string; title: string; type: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setQ("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q)}&locale=${locale}`
        );
        const data = await res.json();
        setResults(data.results ?? []);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q, locale]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 p-4 pt-24"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border border-[var(--ame-border)] bg-[var(--ame-surface)] p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={locale === "ar" ? "ابحث في الموقع..." : "Search the site..."}
          className="w-full rounded-lg border border-[var(--ame-border)] bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--ame-accent)]"
        />
        <ul className="mt-4 max-h-64 overflow-y-auto">
          {loading && (
            <li className="text-sm text-[var(--ame-muted)]">
              {locale === "ar" ? "جاري البحث..." : "Searching..."}
            </li>
          )}
          {!loading && q.length >= 2 && results.length === 0 && (
            <li className="text-sm text-[var(--ame-muted)]">
              {locale === "ar" ? "لا توجد نتائج" : "No results"}
            </li>
          )}
          {results.map((r) => (
            <li key={r.href}>
              <Link
                href={r.href}
                onClick={onClose}
                className="block rounded-lg px-3 py-2 text-sm hover:bg-[var(--ame-border)]"
              >
                {r.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
