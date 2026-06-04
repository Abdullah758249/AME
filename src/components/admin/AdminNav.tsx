"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNav({ links }: { links: { href: string; label: string }[] }) {
  const path = usePathname();

  return (
    <nav className="mt-6 flex flex-col gap-1">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`rounded-lg px-3 py-2 text-sm ${
            path === l.href
              ? "bg-sky-900/50 text-sky-300"
              : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
