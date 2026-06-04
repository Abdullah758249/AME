"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { savePage, deletePage } from "@/lib/admin-actions";
import { useAdminCsrf } from "./useAdminCsrf";
import { RichTextEditor } from "./RichTextEditor";
import type { Page } from "@prisma/client";

export function PageEditor({ page }: { page?: Page }) {
  const csrf = useAdminCsrf();
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [data, setData] = useState({
    slug: page?.slug ?? "",
    titleAr: page?.titleAr ?? "",
    titleEn: page?.titleEn ?? "",
    contentAr: page?.contentAr ?? "",
    contentEn: page?.contentEn ?? "",
    metaDescAr: page?.metaDescAr ?? "",
    metaDescEn: page?.metaDescEn ?? "",
    published: page?.published ?? false,
    inNav: page?.inNav ?? false,
    navOrder: page?.navOrder ?? 0,
  });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await savePage(page?.id ?? null, data, csrf);
    setMsg(res.ok ? "تم الحفظ" : "خطأ");
    if (res.ok && !page) router.push("/ame-admin/pages");
  }

  async function remove() {
    if (!page || !confirm("حذف الصفحة؟")) return;
    await deletePage(page.id, csrf);
    router.push("/ame-admin/pages");
  }

  return (
    <form onSubmit={save} className="max-w-4xl space-y-6">
      <p className="text-xs text-zinc-500">رابط الصفحة: /pages/{data.slug || "..."}</p>
      <input
        placeholder="slug"
        value={data.slug}
        onChange={(e) => setData({ ...data, slug: e.target.value })}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <input
          placeholder="العنوان عربي"
          value={data.titleAr}
          onChange={(e) => setData({ ...data, titleAr: e.target.value })}
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2"
        />
        <input
          placeholder="Title EN"
          value={data.titleEn}
          onChange={(e) => setData({ ...data, titleEn: e.target.value })}
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2"
        />
      </div>
      <RichTextEditor
        label="محتوى الصفحة (عربي)"
        value={data.contentAr}
        onChange={(html) => setData({ ...data, contentAr: html })}
      />
      <RichTextEditor
        label="محتوى الصفحة (إنجليزي)"
        value={data.contentEn}
        onChange={(html) => setData({ ...data, contentEn: html })}
      />
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={data.published}
          onChange={(e) => setData({ ...data, published: e.target.checked })}
        />
        منشور
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={data.inNav}
          onChange={(e) => setData({ ...data, inNav: e.target.checked })}
        />
        في القائمة
      </label>
      <div className="flex gap-4">
        <button type="submit" className="rounded-lg bg-sky-700 px-6 py-2">حفظ</button>
        {page && (
          <button type="button" onClick={remove} className="rounded-lg border border-red-800 px-6 py-2 text-red-400">
            حذف
          </button>
        )}
      </div>
      {msg && <p className="text-green-400">{msg}</p>}
    </form>
  );
}
