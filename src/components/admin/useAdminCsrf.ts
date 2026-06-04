"use client";

export function useAdminCsrf(): string {
  const el = document.querySelector("[data-csrf]");
  return el?.getAttribute("data-csrf") ?? "";
}
