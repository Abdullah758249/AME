"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminLogin } from "@/lib/admin-actions";

export function AdminLoginForm({ csrfToken }: { csrfToken: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [needs2fa, setNeeds2fa] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await adminLogin(
      fd.get("email") as string,
      fd.get("password") as string,
      (fd.get("totp") as string) || undefined,
      csrfToken
    );
    setLoading(false);
    if (res.error) {
      setError(res.error);
      if (res.needs2fa) setNeeds2fa(true);
      return;
    }
    const next = searchParams.get("next") ?? "/ame-admin";
    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <input
        name="email"
        type="email"
        required
        placeholder="البريد الإلكتروني"
        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3"
      />
      <input
        name="password"
        type="password"
        required
        placeholder="كلمة المرور"
        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3"
      />
      <input
        name="totp"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder={
          needs2fa
            ? "رمز المصادقة الثنائية (مطلوب)"
            : "رمز 2FA (إن كان مفعّلًا)"
        }
        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3"
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-sky-700 py-3 font-medium hover:bg-sky-600 disabled:opacity-50"
      >
        {loading ? "..." : "دخول"}
      </button>
    </form>
  );
}
