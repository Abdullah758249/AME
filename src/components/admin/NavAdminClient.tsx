"use client";

import { useState } from "react";
import { saveNavItem, deleteNavItem } from "@/lib/admin-actions";
import { useAdminCsrf } from "./useAdminCsrf";
import type { NavItem } from "@prisma/client";

export function NavAdminClient({ items }: { items: NavItem[] }) {
  const csrf = useAdminCsrf();
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    labelAr: "",
    labelEn: "",
    href: "",
    sortOrder: items.length,
    visible: true,
    isExternal: false,
  });

  async function add(e: React.FormEvent) {
    e.preventDefault();
    await saveNavItem(null, form, csrf);
    setMsg("تمت الإضافة — حدّث الصفحة");
    window.location.reload();
  }

  return (
    <div>
      <table className="mb-8 w-full text-sm">
        <thead>
          <tr className="text-zinc-500">
            <th className="py-2 text-start">عربي</th>
            <th className="py-2 text-start">رابط</th>
            <th className="py-2 text-start">ظاهر</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <NavRow key={item.id} item={item} csrf={csrf} />
          ))}
        </tbody>
      </table>
      <h2 className="mb-4 font-semibold">إضافة عنصر</h2>
      <form onSubmit={add} className="grid max-w-xl gap-3">
        <input placeholder="عربي" value={form.labelAr} onChange={(e) => setForm({ ...form, labelAr: e.target.value })} className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2" />
        <input placeholder="English" value={form.labelEn} onChange={(e) => setForm({ ...form, labelEn: e.target.value })} className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2" />
        <input placeholder="/path" value={form.href} onChange={(e) => setForm({ ...form, href: e.target.value })} className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2" />
        <button type="submit" className="rounded-lg bg-sky-700 py-2">إضافة</button>
      </form>
      {msg && <p className="mt-4 text-green-400">{msg}</p>}
    </div>
  );
}

function NavRow({ item, csrf }: { item: NavItem; csrf: string }) {
  const [data, setData] = useState(item);

  async function save() {
    await saveNavItem(item.id, {
      labelAr: data.labelAr,
      labelEn: data.labelEn,
      href: data.href,
      sortOrder: data.sortOrder,
      visible: data.visible,
      isExternal: data.isExternal,
    }, csrf);
  }

  async function del() {
    if (!confirm("حذف؟")) return;
    await deleteNavItem(item.id, csrf);
    window.location.reload();
  }

  return (
    <tr className="border-t border-zinc-800">
      <td className="py-2">
        <input value={data.labelAr} onChange={(e) => setData({ ...data, labelAr: e.target.value })} className="w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1" />
      </td>
      <td className="py-2">
        <input value={data.href} onChange={(e) => setData({ ...data, href: e.target.value })} className="w-full rounded border border-zinc-700 bg-zinc-800 px-2 py-1" />
      </td>
      <td className="py-2">
        <input type="checkbox" checked={data.visible} onChange={(e) => setData({ ...data, visible: e.target.checked })} />
      </td>
      <td className="py-2 text-end">
        <button type="button" onClick={save} className="text-sky-400">حفظ</button>
        <button type="button" onClick={del} className="ms-2 text-red-400">حذف</button>
      </td>
    </tr>
  );
}
