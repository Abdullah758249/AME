"use client";

import { adminLogout } from "@/lib/admin-actions";
import { useRouter } from "next/navigation";

export function AdminLogoutButton({ csrfToken }: { csrfToken: string }) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await adminLogout(csrfToken);
        router.push("/ame-admin/login");
        router.refresh();
      }}
      className="mt-8 w-full rounded-lg border border-zinc-700 py-2 text-sm text-zinc-400 hover:bg-zinc-800"
    >
      تسجيل الخروج
    </button>
  );
}
