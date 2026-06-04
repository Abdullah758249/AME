import Image from "next/image";
import { normalizeMediaUrl } from "@/lib/media-url";

export function SafeImage({
  src,
  alt,
  className,
  width = 800,
  height = 400,
  priority,
}: {
  src: string | null | undefined;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  const normalized = normalizeMediaUrl(src);
  if (!normalized) return null;

  if (normalized.startsWith("/")) {
    return (
      <Image
        src={normalized}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        unoptimized
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={normalized} alt={alt} className={className} loading="lazy" />
  );
}
