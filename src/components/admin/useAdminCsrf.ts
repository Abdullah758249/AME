// src/components/admin/useAdminCsrf.ts
import { useState, useEffect } from "react";

export function useAdminCsrf(): string {
   const [csrfToken, setCsrfToken] = useState<string>("");

   useEffect(() => {
      // هذا الكود مضمون 100% أنه سيعمل داخل المتصفح فقط بعد الـ Mount
      const el = document.querySelector("[data-csrf]");
      if (el) {
         setCsrfToken(el.getAttribute("data-csrf") ?? "");
      }
   }, []);

   return csrfToken;
}