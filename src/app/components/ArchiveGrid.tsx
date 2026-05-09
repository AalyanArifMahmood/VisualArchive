"use client";

import { useState } from "react";
import Image from "next/image";
import { archiveItems, years } from "../data/archive";
import type { ArchiveItem } from "../data/archive";
import Lightbox from "./Lightbox";

export default function ArchiveGrid() {
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [lightboxItem, setLightboxItem] = useState<ArchiveItem | null>(null);

  const filtered = activeYear
    ? archiveItems.filter((item) => item.year === activeYear)
    : archiveItems;

  return (
    <>
      {/* Year filter buttons */}
      <div className="flex flex-wrap gap-3 mb-10">
        <button
          onClick={() => setActiveYear(null)}
          className={`px-4 py-2 text-xs tracking-widest uppercase border transition-colors ${
            activeYear === null
              ? "bg-sepia text-cream border-sepia"
              : "bg-transparent text-ink-light border-border hover:border-sepia hover:text-ink"
          }`}
        >
          All Years
        </button>
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setActiveYear(year)}
            className={`px-4 py-2 text-xs tracking-widest uppercase border transition-colors ${
              activeYear === year
                  ? "bg-sepia text-cream border-sepia"
                  : "bg-transparent text-ink-light border-border hover:border-sepia hover:text-ink"
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Image grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer"
            onClick={() => setLightboxItem(item)}
          >
            <div className="overflow-hidden bg-cream-dark">
              <Image
                src={item.src}
                alt={item.caption}
                width={800}
                height={600}
                className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="mt-3">
              <p className="text-xs tracking-widest uppercase text-ink-muted">
                {item.year} · Vol. {item.volume}, No. {item.issue}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-light line-clamp-2">
                {item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </>
  );
}
