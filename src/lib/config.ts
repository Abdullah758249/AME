// هذا الملف الآن مخصص للاستخدام في مكونات العميل فقط
import { CSRF_COOKIE, CSRF_HEADER } from './csrf-constants';

export { CSRF_COOKIE, CSRF_HEADER };

// src/lib/config.ts
export function getAdminPath(): string {
  return process.env.ADMIN_PATH || "/ame-admin";
}