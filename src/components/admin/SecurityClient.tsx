"use client";

import { useState } from "react";
import {
  changePassword,
  setupTotp,
  enableTotp,
  disableTotp,
} from "@/lib/admin-actions";
import { useAdminCsrf } from "./useAdminCsrf";

export function SecurityClient({ totpEnabled }: { totpEnabled: boolean }) {
  const csrf = useAdminCsrf();
  const [msg, setMsg] = useState("");
  const [totpUri, setTotpUri] = useState("");

  return (
    <div className="max-w-xl space-y-10">
      <section>
        <h2 className="font-semibold">تغيير كلمة المرور</h2>
        <form
          className="mt-4 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const res = await changePassword(
              fd.get("current") as string,
              fd.get("new") as string,
              csrf
            );
            setMsg(res.ok ? "تم تغيير كلمة المرور" : res.error ?? "خطأ");
          }}
        >
          <input name="current" type="password" placeholder="كلمة المرور الحالية" required className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2" />
          <input name="new" type="password" placeholder="كلمة مرور جديدة (12+ حرف)" required minLength={12} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2" />
          <button type="submit" className="rounded-lg bg-sky-700 px-4 py-2">تحديث</button>
        </form>
      </section>

      <section>
        <h2 className="font-semibold">المصادقة الثنائية (2FA)</h2>
        <p className="mt-2 text-sm text-zinc-500">
          الحالة: {totpEnabled ? "مفعّلة" : "غير مفعّلة"}
        </p>
        {!totpEnabled && (
          <button
            type="button"
            className="mt-4 rounded-lg border border-zinc-600 px-4 py-2 text-sm"
            onClick={async () => {
              const res = await setupTotp(csrf);
              if (res.uri) {
                setTotpUri(res.uri);
                setMsg("امسح الرمز في تطبيق Google Authenticator ثم أدخل الرمز للتفعيل");
              }
            }}
          >
            إعداد 2FA
          </button>
        )}
        {totpUri && (
          <p className="mt-4 break-all text-xs text-zinc-400">{totpUri}</p>
        )}
        <form
          className="mt-4 flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            const code = new FormData(e.currentTarget).get("code") as string;
            const res = totpEnabled
              ? await disableTotp(code, csrf)
              : await enableTotp(code, csrf);
            setMsg(res.ok ? "تم" : res.error ?? "خطأ");
            if (res.ok) window.location.reload();
          }}
        >
          <input name="code" placeholder="رمز 6 أرقام" className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2" />
          <button type="submit" className="rounded-lg bg-sky-700 px-4 py-2">
            {totpEnabled ? "تعطيل" : "تفعيل"}
          </button>
        </form>
      </section>

      {msg && <p className="text-green-400">{msg}</p>}
    </div>
  );
}
