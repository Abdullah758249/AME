"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminCsrf } from "./useAdminCsrf";
import { RichTextEditor } from "./RichTextEditor";
import { MediaPicker } from "./MediaPicker";

export type CmsEntityData = {
  slug: string;
  titleAr: string;
  titleEn: string;
  summaryAr?: string;
  summaryEn?: string;
  contentAr?: string;
  contentEn?: string;
  imageUrl?: string;
  logoUrl?: string;
  websiteUrl?: string;
  statusAr?: string;
  statusEn?: string;
  published: boolean;
  sortOrder?: number;
  publishedAt?: string | null;
};

type FieldKey = keyof CmsEntityData;

export function CmsEntityForm({
  initial,
  onSave,
  onDelete,
  publicPath,
  variant,
}: {
  initial: CmsEntityData;
  onSave: (
    data: CmsEntityData,
    csrf: string
  ) => Promise<{ ok?: boolean; error?: string; slug?: string }>;
  onDelete?: (csrf: string) => Promise<unknown>;
  publicPath?: string;
  variant: "news" | "page" | "subsidiary" | "project";
}) {
  const csrf = useAdminCsrf();
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [data, setData] = useState<CmsEntityData>(initial);

  const set = (key: FieldKey, value: string | boolean | number | null) => {
    setData((d) => ({ ...d, [key]: value }));
  };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await onSave(data, csrf);
    setMsg(res.ok ? "تم الحفظ" : res.error ?? "خطأ");
    if (res.ok && !onDelete) router.back();
  }

  async function remove() {
    if (!onDelete || !confirm("حذف؟")) return;
    await onDelete(csrf);
    router.back();
  }

  const featuredLabel =
    variant === "subsidiary"
      ? "شعار الشركة (صورة مميزة أعلى الصفحة)"
      : "صورة مميزة (أعلى الصفحة — منفصلة عن صور داخل النص)";

  const featuredKey: "imageUrl" | "logoUrl" =
    variant === "subsidiary" ? "logoUrl" : "imageUrl";

  return (
    <form onSubmit={save} className="max-w-4xl space-y-6">
      {publicPath && (
        <p className="text-xs text-zinc-500">الرابط العام: {publicPath}</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="المعرّف (slug)" value={data.slug} onChange={(v) => set("slug", v)} />
        {variant !== "page" && (
          <Field
            label="الترتيب"
            type="number"
            value={String(data.sortOrder ?? 0)}
            onChange={(v) => set("sortOrder", parseInt(v, 10) || 0)}
          />
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="العنوان (عربي)" value={data.titleAr} onChange={(v) => set("titleAr", v)} />
        <Field label="العنوان (إنجليزي)" value={data.titleEn} onChange={(v) => set("titleEn", v)} />
      </div>

      {(variant === "news" || variant === "project" || variant === "subsidiary") && (
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="ملخص (عربي)"
            multiline
            value={data.summaryAr ?? ""}
            onChange={(v) => set("summaryAr", v)}
          />
          <Field
            label="ملخص (إنجليزي)"
            multiline
            value={data.summaryEn ?? ""}
            onChange={(v) => set("summaryEn", v)}
          />
        </div>
      )}

      {variant === "project" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="الحالة (عربي)" value={data.statusAr ?? ""} onChange={(v) => set("statusAr", v)} />
          <Field label="الحالة (إنجليزي)" value={data.statusEn ?? ""} onChange={(v) => set("statusEn", v)} />
        </div>
      )}

      {variant === "subsidiary" && (
        <Field label="رابط الموقع" value={data.websiteUrl ?? ""} onChange={(v) => set("websiteUrl", v)} />
      )}

      <MediaPicker
        label={featuredLabel}
        value={data[featuredKey] ?? ""}
        onChange={(url) => set(featuredKey, url)}
        mode="image"
        hint="ارفع من المكتبة — لا تلصق مسار C:\ أو file://"
      />

      <RichTextEditor
        label="المحتوى (عربي) — محرر مرئي"
        value={data.contentAr ?? ""}
        onChange={(html) => set("contentAr", html)}
        placeholder="اكتب ونسّق المحتوى بالعربية..."
      />
      <RichTextEditor
        label="المحتوى (إنجليزي) — محرر مرئي"
        value={data.contentEn ?? ""}
        onChange={(html) => set("contentEn", html)}
        placeholder="Write content in English..."
      />

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={data.published}
          onChange={(e) => set("published", e.target.checked)}
        />
        منشور على الموقع العام
      </label>

      <div className="flex gap-4">
        <button type="submit" className="rounded-lg bg-sky-700 px-6 py-2 hover:bg-sky-600">
          حفظ
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={remove}
            className="rounded-lg border border-red-800 px-6 py-2 text-red-400"
          >
            حذف
          </button>
        )}
      </div>
      {msg && <p className="text-green-400">{msg}</p>}
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  multiline,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm text-zinc-400">{label}</label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2"
        />
      )}
    </div>
  );
}
