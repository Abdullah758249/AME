"use client";

import { useState } from "react";
import { uploadMedia } from "@/lib/admin-actions";
import { useAdminCsrf } from "./useAdminCsrf";

type M = { id: string; url: string; filename: string; mimeType: string; size: number };

export function MediaUploadClient({ media }: { media: M[] }) {
  const csrf = useAdminCsrf();
  const [status, setStatus] = useState("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.set("file", file);
    const res = await uploadMedia(fd, csrf);
    setStatus(res.ok ? `تم الرفع: ${res.url}` : res.error ?? "فشل");
    if (res.ok) window.location.reload();
  }

  return (
    <div>
      <input type="file" onChange={onFile} className="mb-6" />
      <p className="mb-4 text-xs text-zinc-500">
        صور، PDF، Word، Excel، نص، فيديو — حتى 15MB. انسخ الرابط لاستخدامه في المحرر أو الصورة المميزة.
      </p>
      {status && <p className="mb-4 text-green-400">{status}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {media.map((m) => (
          <div key={m.id} className="rounded-xl border border-zinc-800 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.url} alt={m.filename} className="h-32 w-full object-contain" />
            <p className="mt-2 truncate text-xs text-zinc-500">{m.url}</p>
            <button
              type="button"
              onClick={() => navigator.clipboard.writeText(m.url)}
              className="mt-2 text-xs text-sky-400"
            >
              نسخ الرابط
            </button>
          </div>
        ))}
      </div>
      {media.length === 0 && <p className="text-zinc-500">لا توجد ملفات مرفوعة.</p>}
    </div>
  );
}
