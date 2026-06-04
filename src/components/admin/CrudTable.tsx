"use client";

import Link from "next/link";

export function CrudTable({
  basePath,
  items,
  columns,
}: {
  basePath: string;
  items: { id: string; [key: string]: unknown }[];
  columns: { key: string; label: string }[];
}) {
  return (
    <div>
      <Link
        href={`${basePath}/new`}
        className="mb-4 inline-block rounded-lg bg-sky-700 px-4 py-2 text-sm hover:bg-sky-600"
      >
        + إضافة
      </Link>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-zinc-500">
            {columns.map((c) => (
              <th key={c.key} className="py-2 text-start">
                {c.label}
              </th>
            ))}
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t border-zinc-800">
              {columns.map((c) => (
                <td key={c.key} className="py-2">
                  {String(item[c.key] ?? "")}
                </td>
              ))}
              <td className="py-2 text-end">
                <Link href={`${basePath}/${item.id}`} className="text-sky-400 hover:underline">
                  تعديل
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && (
        <p className="mt-4 text-zinc-500">لا توجد عناصر — أضف من الزر أعلاه</p>
      )}
    </div>
  );
}
