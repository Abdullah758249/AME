// src/app/ame-admin/login/page.tsx
import { getCsrfToken } from "@/lib/csrf";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage() {
  const csrfToken = await getCsrfToken();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800 p-4">
      <div className="w-full max-w-md rounded-xl bg-zinc-900 p-8 shadow-xl">
        <h1 className="text-center text-2xl font-bold text-white">لوحة الإدارة</h1>
        <p className="text-center text-zinc-400 mt-2">سجل دخولك للمتابعة</p>
        <AdminLoginForm csrfToken={csrfToken} />
      </div>
    </div>
  );
}