"use client";

import { markMessageRead, deleteMessage } from "@/lib/admin-actions";
import { useAdminCsrf } from "./useAdminCsrf";

type Msg = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: Date;
};

export function MessagesClient({ messages }: { messages: Msg[] }) {
  const csrf = useAdminCsrf();

  if (messages.length === 0) {
    return <p className="text-zinc-500">لا توجد رسائل بعد.</p>;
  }

  return (
    <ul className="space-y-4">
      {messages.map((m) => (
        <li
          key={m.id}
          className={`rounded-xl border p-4 ${m.read ? "border-zinc-800" : "border-sky-900 bg-sky-950/20"}`}
        >
          <div className="flex justify-between text-sm">
            <span className="font-medium">{m.name}</span>
            <time className="text-zinc-500">
              {new Date(m.createdAt).toLocaleString("ar-EG")}
            </time>
          </div>
          <p className="text-sm text-zinc-400">{m.email}</p>
          {m.phone && <p className="text-sm">{m.phone}</p>}
          {m.subject && <p className="mt-2 font-medium">{m.subject}</p>}
          <p className="mt-2 whitespace-pre-wrap text-zinc-300">{m.message}</p>
          <div className="mt-4 flex gap-4">
            {!m.read && (
              <button
                type="button"
                onClick={() => markMessageRead(m.id, csrf)}
                className="text-sm text-sky-400"
              >
                تعليم كمقروء
              </button>
            )}
            <button
              type="button"
              onClick={() => deleteMessage(m.id, csrf).then(() => location.reload())}
              className="text-sm text-red-400"
            >
              حذف
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
