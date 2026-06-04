"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function VisitTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("path", pathname + (searchParams?.toString() ? `?${searchParams}` : ""));
    const ref = document.referrer;
    if (ref) params.set("referrer", ref);
    fetch(`/api/track?${params.toString()}`, { method: "GET", keepalive: true }).catch(() => {});
  }, [pathname, searchParams]);

  return null;
}
