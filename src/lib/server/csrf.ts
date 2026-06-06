import { cookies } from "next/headers";
import { timingSafeEqual } from "crypto";
import { CSRF_COOKIE } from "@/lib/csrf-constants";
import { createCsrfToken } from "@/lib/csrf-token";

export async function getCsrfTokenFromServer() {
  return cookies().get(CSRF_COOKIE)?.value;
}

export async function setCsrfCookieOnServer() {
  const token = createCsrfToken();
  cookies().set(CSRF_COOKIE, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 2,
  });
  return token;
}