import { NextRequest, NextResponse } from "next/server";
import { recordVisit, parseReferrerSource } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") ?? "/";
  const referrer = request.nextUrl.searchParams.get("referrer");
  const country = request.nextUrl.searchParams.get("country") ?? undefined;
  const vid = request.nextUrl.searchParams.get("vid") ?? undefined;
  const userAgent = request.headers.get("user-agent") ?? undefined;

  const source = parseReferrerSource(referrer, request.nextUrl.searchParams);

  try {
    await recordVisit({
      path: path.slice(0, 500),
      referrer: referrer?.slice(0, 2000) ?? undefined,
      source: source.slice(0, 200),
      country: country?.slice(0, 100),
      userAgent: userAgent?.slice(0, 500),
      sessionId: vid?.slice(0, 64),
    });
  } catch {
    /* db unavailable */
  }

  return new NextResponse(null, { status: 204 });
}
