"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminCsrf } from "./useAdminCsrf";

type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "textarea" | "checkbox" | "number";
};

export function EntityEditor<T extends Record<string, unknown>>({
  initial,
  fields,
  onSave,
  onDelete,
  publicPath,
}: {
  initial: T;
  fields: FieldDef[];
  onSave: (data: T, csrf: string) => Promise<{ ok?: boolean; error?: string }>;
  onDelete?: (csrf: string) => Promise<unknown>;
  publicPath?: string;
}) {
  const csrf = useAdminCsrf();
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [data, setData] = useState<T>(initial);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await onSave(data, csrf);
    setMsg(res.ok ? "تم الحفظ" : res.error ?? "خطأ");
    if (res.ok && onDelete === undefined && !(initial as { id?: string }).id) {
      router.back();
    }
  }

  async function remove() {
    if (!onDelete || !confirm("حذف؟")) return;
    await onDelete(csrf);
    router.back();
  }

  return (
    <form onSubmit={save} className="max-w-3xl space-y-4">
      {publicPath && (
        <p className="text-xs text-zinc-500">
          الرابط العام: {publicPath}
        </p>
      )}
      {fields.map((f) => (
        <div key={f.key}>
          <label className="text-sm text-zinc-400">{f.label}</label>
          {f.type === "textarea" ? (
            <textarea
              rows={5}
              value={String(data[f.key] ?? "")}
              onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2"
            />
          ) : f.type === "checkbox" ? (
            <input
              type="checkbox"
              checked={Boolean(data[f.key])}
              onChange={(e) => setData({ ...data, [f.key]: e.target.checked })}
              className="ms-2"
            />
          ) : f.type === "number" ? (
            <input
              type="number"
              value={Number(data[f.key] ?? 0)}
              onChange={(e) => setData({ ...data, [f.key]: parseInt(e.target.value, 10) })}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2"
            />
          ) : (
            <input
              value={String(data[f.key] ?? "")}
              onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2"
            />
          )}
        </div>
      ))}
      <div className="flex gap-4">
        <button type="submit" className="rounded-lg bg-sky-700 px-6 py-2">حفظ</button>
        {onDelete && (
          <button type="button" onClick={remove} className="rounded-lg border border-red-800 px-6 py-2 text-red-400">
            حذف
          </button>
        )}
      </div>
      {msg && <p className="text-green-400">{msg}</p>}
    </form>
  );
}
