import 'server-only'; // يحمي من الاستيراد الخطأ من العميل[reference:3]
import { cookies, headers } from 'next/headers';
import { timingSafeEqual } from 'crypto';
import { CSRF_COOKIE, CSRF_REQUEST_HEADER } from '@/lib/csrf-constants';
import { createCsrfToken } from '@/lib/csrf-token';

export async function getCsrfToken(): Promise<string> {
  const headersList = await headers();
  const fromMiddleware = headersList.get(CSRF_REQUEST_HEADER);
  if (fromMiddleware) return fromMiddleware;
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_COOKIE)?.value ?? '';
}

export async function validateCsrf(headerToken: string | null): Promise<boolean> {
  if (!headerToken) return false;
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_COOKIE)?.value;
  if (!cookieToken) return false;
  try {
    const a = Buffer.from(headerToken);
    const b = Buffer.from(cookieToken);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export { CSRF_HEADER, CSRF_COOKIE } from '@/lib/csrf-constants';