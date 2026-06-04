"use client";

import { useState } from "react";
import { updateLeadership } from "@/lib/admin-actions";
import { useAdminCsrf } from "./useAdminCsrf";
import { MediaPicker } from "./MediaPicker";
import { RichTextEditor } from "./RichTextEditor";
import type { Leadership } from "@prisma/client";

export function LeadershipAdminForm({ leader }: { leader: Leadership | null }) {
  const csrf = useAdminCsrf();
  const [msg, setMsg] = useState("");
  const [data, setData] = useState({
    nameAr: leader?.nameAr ?? "عبدالله محمد إمام",
    nameEn: leader?.nameEn ?? "Abdullah Mohamed Imam",
    titleAr:
      leader?.titleAr ??
      "المؤسس، الرئيس التنفيذي (CEO)، المدير العام، والمساهم الأكبر في AME",
    titleEn:
      leader?.titleEn ??
      "Founder, Chief Executive Officer (CEO), Managing Director and Majority Shareholder of AME",
    bioAr: leader?.bioAr ?? "",
    bioEn: leader?.bioEn ?? "",
    imageUrl: leader?.imageUrl ?? "",
  });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await updateLeadership(data, csrf);
    setMsg(res.ok ? "تم الحفظ" : "خطأ");
  }

  return (
    <form onSubmit={save} className="max-w-2xl space-y-4">
      {(["nameAr", "nameEn", "titleAr", "titleEn"] as const).map((k) => (
        <div key={k}>
          <label className="text-sm text-zinc-400">{k}</label>
          <input
            value={data[k]}
            onChange={(e) => setData({ ...data, [k]: e.target.value })}
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2"
          />
        </div>
      ))}
      <MediaPicker
        label="صورة القيادة"
        value={data.imageUrl}
        onChange={(url) => setData({ ...data, imageUrl: url })}
        mode="image"
      />
      <RichTextEditor
        label="نبذة (عربي)"
        value={data.bioAr}
        onChange={(html) => setData({ ...data, bioAr: html })}
      />
      <RichTextEditor
        label="Bio (English)"
        value={data.bioEn}
        onChange={(html) => setData({ ...data, bioEn: html })}
      />
      <button type="submit" className="rounded-lg bg-sky-700 px-6 py-2">
        حفظ
      </button>
      {msg && <p className="text-green-400">{msg}</p>}
    </form>
  );
}
