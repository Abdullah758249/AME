"use client";

import { useState } from "react";
import { useLocale } from "./LocaleProvider";
import { CSRF_HEADER } from "@/lib/csrf-constants";

export function ContactForm({ csrfToken }: { csrfToken: string }) {
  const { locale } = useLocale();
  const isAr = locale === "ar";
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [CSRF_HEADER]: csrfToken,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-lg space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">
          {isAr ? "الاسم" : "Name"} *
        </label>
        <input name="name" required minLength={2} className="ame-input w-full" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">
          {isAr ? "البريد الإلكتروني" : "Email"} *
        </label>
        <input name="email" type="email" required className="ame-input w-full" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">
          {isAr ? "الهاتف" : "Phone"}
        </label>
        <input name="phone" className="ame-input w-full" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">
          {isAr ? "الموضوع" : "Subject"}
        </label>
        <input name="subject" className="ame-input w-full" />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">
          {isAr ? "الرسالة" : "Message"} *
        </label>
        <textarea name="message" required minLength={10} rows={5} className="ame-input w-full" />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-[var(--ame-accent)] px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {status === "loading"
          ? isAr
            ? "جاري الإرسال..."
            : "Sending..."
          : isAr
            ? "إرسال"
            : "Send"}
      </button>
      {status === "ok" && (
        <p className="text-center text-sm text-green-600 dark:text-green-400">
          {isAr
            ? "تم استلام رسالتك وحفظها. سنتواصل معك عند الحاجة."
            : "Your message was received and saved. We will respond when appropriate."}
        </p>
      )}
      {status === "error" && (
        <p className="text-center text-sm text-red-600">
          {isAr ? "حدث خطأ. حاول مرة أخرى." : "An error occurred. Please try again."}
        </p>
      )}
    </form>
  );
}
