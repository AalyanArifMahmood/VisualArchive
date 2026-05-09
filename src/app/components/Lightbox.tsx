"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import type { ArchiveItem } from "../data/archive";

interface LightboxProps {
  item: ArchiveItem | null;
  onClose: () => void;
}

export default function Lightbox({ item, onClose }: LightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (item) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, handleKeyDown]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-cream p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-ink-muted hover:text-ink transition-colors text-2xl"
          aria-label="Close lightbox"
        >
          ×
        </button>

        <div className="relative w-full aspect-[4/3]">
          <Image
            src={item.src}
            alt={item.caption}
            fill
            className="object-contain"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>

        <div className="mt-4 pb-2">
          <p className="text-xs tracking-widest uppercase text-ink-muted mb-2">
            {item.year} · Vol. {item.volume}, Issue {item.issue}
          </p>
          <p className="text-sm leading-relaxed text-ink-light">
            {item.caption}
          </p>
        </div>
      </div>
    </div>
  );
}
