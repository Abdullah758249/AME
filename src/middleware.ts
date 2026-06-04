import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { CSRF_COOKIE, CSRF_REQUEST_HEADER } from "@/lib/csrf-constants";
import { createCsrfToken } from "@/lib/csrf-token";

const VISITOR_COOKIE = "ame_vid";
const ADMIN_PATH = process.env.ADMIN_PATH ?? "/ame-admin";

function getSecret(): Uint8Array | null {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

async function hasValidAdminSession(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("ame_admin_session")?.value;
  const secret = getSecret();
  if (!token || !secret) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

function applyCsrf(
  request: NextRequest,
  response: NextResponse,
  requestHeaders: Headers
): void {
  let token = request.cookies.get(CSRF_COOKIE)?.value;
  if (!token) {
    token = createCsrfToken();
    response.cookies.set(CSRF_COOKIE, token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 2,
    });
  }
  requestHeaders.set(CSRF_REQUEST_HEADER, token);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const adminBase = ADMIN_PATH.replace(/\/$/, "");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  if (pathname.startsWith(adminBase)) {
    const isLogin =
      pathname === `${adminBase}/login` ||
      pathname.startsWith(`${adminBase}/login/`);
    const isApi = pathname.startsWith(`${adminBase}/api/`);

    if (!isLogin && !isApi) {
      const authed = await hasValidAdminSession(request);
      if (!authed) {
        const loginUrl = new URL(`${adminBase}/login`, request.url);
        loginUrl.searchParams.set("next", pathname);
        const redirect = NextResponse.redirect(loginUrl);
        applyCsrf(request, redirect, requestHeaders);
        return redirect;
      }
    }
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    applyCsrf(request, response, requestHeaders);
    return response;
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  applyCsrf(request, response, requestHeaders);

  let visitorId = request.cookies.get(VISITOR_COOKIE)?.value;
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    response.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  if (
    !pathname.startsWith("/api/") &&
    !pathname.startsWith("/_next") &&
    !pathname.includes(".") &&
    pathname !== "/favicon.ico"
  ) {
    const trackUrl = new URL("/api/track", request.url);
    trackUrl.searchParams.set("path", pathname);
    const ref = request.headers.get("referer");
    if (ref) trackUrl.searchParams.set("referrer", ref);
    const country =
      request.headers.get("x-vercel-ip-country") ??
      request.headers.get("cf-ipcountry");
    if (country) trackUrl.searchParams.set("country", country);
    trackUrl.searchParams.set("vid", visitorId);

    response.headers.set("x-ame-track", trackUrl.pathname + trackUrl.search);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|uploads/).*)"],
};
