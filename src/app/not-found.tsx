import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-[var(--ame-muted)]">الصفحة غير موجودة</p>
      <Link href="/" className="mt-8 inline-block text-[var(--ame-accent)] hover:underline">
        الرئيسية
      </Link>
    </div>
  );
}
