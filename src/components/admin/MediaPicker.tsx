"use client";

import { useCallback, useEffect, useState } from "react";
import { uploadMedia, listMedia } from "@/lib/admin-actions";
import { useAdminCsrf } from "./useAdminCsrf";
import { ImagePlus, Upload, FileText, X } from "lucide-react";

type MediaItem = {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
};

export function MediaPicker({
  label,
  value,
  onChange,
  mode = "image",
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  mode?: "image" | "any";
  hint?: string;
}) {
  const csrf = useAdminCsrf();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listMedia();
      setItems(list);
    } catch {
      setStatus("تعذر تحميل الوسائط");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("جاري الرفع...");
    const fd = new FormData();
    fd.set("file", file);
    const res = await uploadMedia(fd, csrf);
    if (res.ok && res.url) {
      onChange(res.url);
      setStatus("تم الرفع");
      await load();
      if (mode === "image" && res.isImage) setOpen(false);
    } else {
      setStatus(res.error ?? "فشل الرفع");
    }
    e.target.value = "";
  }

  const filtered =
    mode === "image"
      ? items.filter((i) => i.mimeType.startsWith("image/"))
      : items;

  return (
    <div className="space-y-2">
      <label className="text-sm text-zinc-400">{label}</label>
      {hint && <p className="text-xs text-zinc-500">{hint}</p>}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-600 px-3 py-2 text-sm hover:bg-zinc-800"
        >
          <ImagePlus className="h-4 w-4" />
          اختر من الوسائط أو ارفع
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs text-red-400"
          >
            إزالة
          </button>
        )}
      </div>
      {value && value.startsWith("/uploads/") && mode === "image" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mt-2 max-h-32 rounded-lg border border-zinc-700 object-contain" />
      )}
      {value && !value.startsWith("/uploads/") && (
        <p className="text-xs text-amber-400">
          الرابط غير صالح — استخدم رفع الوسائط وليس مسار ملف من الجهاز
        </p>
      )}

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-zinc-700 bg-zinc-900 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
              <h3 className="font-semibold">مكتبة الوسائط</h3>
              <button type="button" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="border-b border-zinc-800 px-4 py-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-sky-700 px-4 py-2 text-sm hover:bg-sky-600">
                <Upload className="h-4 w-4" />
                رفع ملف جديد
                <input
                  type="file"
                  className="hidden"
                  accept={mode === "image" ? "image/*" : undefined}
                  onChange={onUpload}
                />
              </label>
              {status && <span className="ms-3 text-sm text-zinc-400">{status}</span>}
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {loading && <p className="text-sm text-zinc-500">جاري التحميل...</p>}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {filtered.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onChange(m.url);
                      setOpen(false);
                    }}
                    className="rounded-lg border border-zinc-700 p-2 text-start hover:border-sky-600"
                  >
                    {m.mimeType.startsWith("image/") ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.url} alt="" className="mb-2 h-20 w-full object-cover rounded" />
                    ) : (
                      <FileText className="mb-2 h-20 w-10 text-zinc-500" />
                    )}
                    <p className="truncate text-xs text-zinc-400">{m.filename}</p>
                  </button>
                ))}
              </div>
              {!loading && filtered.length === 0 && (
                <p className="text-sm text-zinc-500">لا توجد ملفات — ارفع ملفًا أعلاه</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
