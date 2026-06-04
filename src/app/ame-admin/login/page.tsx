import { getCsrfToken } from "@/lib/csrf";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage() {
  const csrfToken = await getCsrfToken();
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <h1 className="text-2xl font-bold">AME — لوحة الإدارة</h1>
        <p className="mt-2 text-sm text-zinc-400">تسجيل الدخول مطلوب</p>
        <AdminLoginForm csrfToken={csrfToken} />
      </div>
    </div>
  );
}
