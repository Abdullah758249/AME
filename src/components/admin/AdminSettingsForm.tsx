"use client";

import { useState } from "react";
import { updateSiteSettings } from "@/lib/admin-actions";
import { useAdminCsrf } from "./useAdminCsrf";
import type { SiteSettings } from "@prisma/client";

const fields: { key: keyof SiteSettings; label: string }[] = [
  { key: "companyNameAr", label: "اسم الشركة (عربي)" },
  { key: "companyNameEn", label: "اسم الشركة (إنجليزي)" },
  { key: "taglineAr", label: "الشعار (عربي)" },
  { key: "taglineEn", label: "الشعار (إنجليزي)" },
  { key: "phone", label: "الهاتف" },
  { key: "email", label: "البريد" },
  { key: "addressAr", label: "العنوان (عربي)" },
  { key: "addressEn", label: "العنوان (إنجليزي)" },
  { key: "logoUrl", label: "رابط الشعار" },
  { key: "aboutAr", label: "من نحن (عربي)" },
  { key: "aboutEn", label: "من نحن (إنجليزي)" },
  { key: "visionAr", label: "الرؤية (عربي)" },
  { key: "visionEn", label: "الرؤية (إنجليزي)" },
  { key: "missionAr", label: "الرسالة (عربي)" },
  { key: "missionEn", label: "الرسالة (إنجليزي)" },
  { key: "valuesAr", label: "القيم (عربي)" },
  { key: "valuesEn", label: "القيم (إنجليزي)" },
  { key: "homeIntroAr", label: "مقدمة الرئيسية (عربي)" },
  { key: "homeIntroEn", label: "مقدمة الرئيسية (إنجليزي)" },
];

export function AdminSettingsForm({ settings }: { settings: SiteSettings }) {
  const csrf = useAdminCsrf();
  const [msg, setMsg] = useState("");
  const [data, setData] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of fields) {
      const v = settings[f.key];
      init[f.key as string] = typeof v === "string" ? v : "";
    }
    return init;
  });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await updateSiteSettings(data, csrf);
    setMsg(res.ok ? "تم الحفظ" : "خطأ");
  }

  return (
    <form onSubmit={save} className="max-w-3xl space-y-4">
      {fields.map((f) => (
        <div key={f.key as string}>
          <label className="mb-1 block text-sm text-zinc-400">{f.label}</label>
          {(f.key as string).includes("about") ||
          (f.key as string).includes("vision") ||
          (f.key as string).includes("mission") ||
          (f.key as string).includes("values") ||
          (f.key as string).includes("Intro") ? (
            <textarea
              rows={4}
              value={data[f.key as string] ?? ""}
              onChange={(e) =>
                setData({ ...data, [f.key as string]: e.target.value })
              }
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2"
            />
          ) : (
            <input
              value={data[f.key as string] ?? ""}
              onChange={(e) =>
                setData({ ...data, [f.key as string]: e.target.value })
              }
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2"
            />
          )}
        </div>
      ))}
      <button type="submit" className="rounded-lg bg-sky-700 px-6 py-2 hover:bg-sky-600">
        حفظ
      </button>
      {msg && <p className="text-sm text-green-400">{msg}</p>}
    </form>
  );
}
