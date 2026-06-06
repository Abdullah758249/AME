import { timingSafeEqual } from "crypto";
import {
  CSRF_COOKIE,
  CSRF_HEADER,
  CSRF_REQUEST_HEADER,
} from "./csrf-constants";
import { createCsrfToken as generateToken } from "./csrf-token";

// دوال خالصة (pure) لا تعتمد على next/headers
export function createCsrfToken() {
  return generateToken();
}

export function validateCsrfToken(headerToken: string, cookieToken: string): boolean {
  if (!headerToken || !cookieToken) return false;
  try {
    const a = Buffer.from(headerToken);
    const b = Buffer.from(cookieToken);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// إعادة تصدير الثوابت
export { CSRF_HEADER, CSRF_COOKIE, CSRF_REQUEST_HEADER };