// src/components/admin/AdminLoginForm.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { adminLogin } from "@/lib/admin-actions";

interface AdminLoginFormProps {
  csrfToken: string;
}

export function AdminLoginForm({ csrfToken }: AdminLoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needs2fa, setNeeds2fa] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const totp = formData.get("totp") as string;

    const res = await adminLogin(email, password, totp || undefined, csrfToken);

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
        suppressHydrationWarning
      />
      <input
        name="password"
        type="password"
        required
        placeholder="كلمة المرور"
        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3"
        suppressHydrationWarning
      />
      <input
        name="totp"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder={needs2fa ? "رمز المصادقة الثنائية (مطلوب)" : "رمز 2FA (إن كان مفعّلًا)"}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3"
        suppressHydrationWarning
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-sky-700 py-3 font-medium hover:bg-sky-600 disabled:opacity-50"
        suppressHydrationWarning
      >
        {loading ? "جاري الدخول..." : "دخول"}
      </button>
    </form>
  );
}