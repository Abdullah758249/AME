import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { randomBytes, createHash } from "crypto";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "ame_admin_session";
const SESSION_DAYS = 7;

function getSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

// تعريف hashToken أولاً
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function createAdminSession(userId: string, ip?: string, userAgent?: string): Promise<string> {
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);

  await prisma.adminSession.create({
    data: { userId, tokenHash, expiresAt, ipAddress: ip, userAgent: userAgent?.slice(0, 500) },
  });

  const jwt = await new SignJWT({ sid: tokenHash, uid: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(`${SESSION_DAYS}d`)
    .setIssuedAt()
    .sign(getSecret());

  (await cookies()).set(COOKIE_NAME, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });

  return rawToken;
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, getSecret());
      if (payload.sid) await prisma.adminSession.deleteMany({ where: { tokenHash: payload.sid as string } });
    } catch {}
  }
  cookieStore.delete(COOKIE_NAME);
}

export type AdminSessionUser = { id: string; email: string; name: string | null; totpEnabled: boolean };

export async function getAdminSession(): Promise<AdminSessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const session = await prisma.adminSession.findFirst({
      where: { tokenHash: payload.sid as string, userId: payload.uid as string, expiresAt: { gt: new Date() } },
      include: { user: true },
    });
    if (!session?.user) return null;
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      totpEnabled: session.user.totpEnabled,
    };
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<AdminSessionUser> {
  const user = await getAdminSession();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}