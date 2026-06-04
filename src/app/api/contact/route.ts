import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { validateCsrf, CSRF_HEADER } from "@/lib/csrf";
import { stripHtml } from "@/lib/sanitize";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().max(30).optional(),
  subject: z.string().max(200).optional(),
  message: z.string().min(10).max(5000),
});

export async function POST(request: NextRequest) {
  const csrf = request.headers.get(CSRF_HEADER);
  if (!(await validateCsrf(csrf))) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }

  const { name, email, phone, subject, message } = parsed.data;

  await prisma.contactMessage.create({
    data: {
      name: stripHtml(name),
      email: email.toLowerCase().trim(),
      phone: phone ? stripHtml(phone) : null,
      subject: subject ? stripHtml(subject) : null,
      message: stripHtml(message),
    },
  });

  return NextResponse.json({ ok: true });
}
