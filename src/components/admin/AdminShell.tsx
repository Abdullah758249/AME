'use client'; // اجعله Client Component ليتجنب استيراد دوال السيرفر

import Link from "next/link";
import { AdminNav } from "./AdminNav";
import { AdminLogoutButton } from "./AdminLogoutButton";

interface AdminShellProps {
  children: React.ReactNode;
  title: string;
  user: { email: string }; // استقبل المستخدم كـ prop
  csrfToken: string;
}

export function AdminShell({ children, title, user, csrfToken }: AdminShellProps) {
  const links = [
    { href: "/ame-admin", label: "لوحة التحكم" },
    { href: "/ame-admin/analytics", label: "الإحصائيات" },
    { href: "/ame-admin/settings", label: "إعدادات الموقع" },
    { href: "/ame-admin/leadership", label: "القيادة" },
    { href: "/ame-admin/pages", label: "الصفحات" },
    { href: "/ame-admin/navigation", label: "القوائم" },
    { href: "/ame-admin/subsidiaries", label: "الشركات التابعة" },
    { href: "/ame-admin/projects", label: "المشاريع" },
    { href: "/ame-admin/news", label: "الأخبار" },
    { href: "/ame-admin/messages", label: "الرسائل" },
    { href: "/ame-admin/media", label: "الوسائط" },
    { href: "/ame-admin/security", label: "الأمان" },
    { href: "/ame-admin/audit", label: "سجل العمليات" },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 border-e border-zinc-800 bg-zinc-900 p-4">
        <p className="font-bold text-sky-400">AME Admin</p>
        <p className="mt-1 truncate text-xs text-zinc-500">{user.email}</p>
        <AdminNav links={links} />
        <AdminLogoutButton csrfToken={csrfToken} />
        <Link href="/" className="mt-6 block text-xs text-zinc-500 hover:text-zinc-300">
          ← الموقع العام
        </Link>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <h1 className="mb-8 text-2xl font-bold">{title}</h1>
        <div data-csrf={csrfToken}>{children}</div>
      </main>
    </div>
  );
}