"use client";

import Image from "next/image";
import { useState } from "react";

type FallbackImageProps = {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
  fallbackLabel?: string;
};

export function FallbackImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
  fallbackLabel = "Image placeholder"
}: FallbackImageProps) {
  const [imageFailed, setImageFailed] = useState(false);

  if (imageFailed) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-[var(--fallback)] text-center text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
        <span className="max-w-[14rem] px-6 leading-5">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      priority={priority}
      onError={() => {
        console.warn(`Missing or unreadable image: ${src}. Put the file in public/images and use a path like /images/file-name.jpg.`);
        setImageFailed(true);
      }}
    />
  );
}
