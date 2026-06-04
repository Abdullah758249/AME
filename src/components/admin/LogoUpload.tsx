"use client";

import { useState } from "react";
import { updateSiteSettings } from "@/lib/admin-actions";
import { useAdminCsrf } from "./useAdminCsrf";
import { MediaPicker } from "./MediaPicker";
import { isDisplayableMediaUrl } from "@/lib/media-url";

export function LogoUpload({ currentLogo }: { currentLogo: string | null }) {
  const csrf = useAdminCsrf();
  const [logo, setLogo] = useState(currentLogo ?? "");
  const [status, setStatus] = useState("");

  async function applyLogo(url: string) {
    setLogo(url);
    if (!url) return;
    const res = await updateSiteSettings({ logoUrl: url }, csrf);
    setStatus(res.ok ? "تم تحديث الشعار" : "خطأ");
  }

  return (
    <div className="mb-8 rounded-xl border border-zinc-800 p-4">
      <MediaPicker
        label="شعار الموقع"
        value={logo}
        onChange={applyLogo}
        mode="image"
        hint="ارفع الشعار إلى مكتبة الوسائط — لا تستخدم مسار ملف من الكمبيوتر"
      />
      {isDisplayableMediaUrl(logo) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt="Logo" className="mt-2 h-16 object-contain" />
      )}
      {status && <p className="mt-2 text-sm text-green-400">{status}</p>}
    </div>
  );
}
