export function getAdminPath(): string {
  const path = process.env.ADMIN_PATH ?? "/ame-admin";
  return path.startsWith("/") ? path : `/${path}`;
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
