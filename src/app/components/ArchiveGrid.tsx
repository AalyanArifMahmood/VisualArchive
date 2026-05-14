"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { archiveItems, years } from "../data/archive";
import type { ArchiveItem } from "../data/archive";
import Lightbox from "./Lightbox";
import EditEntryModal from "./EditEntryModal";

const ADMIN_EMAILS = [
  "aalyanarif875@gmail.com",
  "mahnoorlali1@gmail.com",
];

interface DisplayItem extends ArchiveItem {
  displaySrc: string;
  displayYear: string;
  displayVolume: string;
  displayIssue: string;
  displayCaption: string;
}

export default function ArchiveGrid() {
  const { data: session } = useSession();
  const isAdmin = !!session?.user?.email && ADMIN_EMAILS.includes(session.user.email);

  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [lightboxItem, setLightboxItem] = useState<ArchiveItem | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [displayItems, setDisplayItems] = useState<DisplayItem[]>(
    archiveItems.map((item) => ({
      ...item,
      displaySrc: item.src,
      displayYear: String(item.year),
      displayVolume: String(item.volume),
      displayIssue: String(item.issue),
      displayCaption: item.caption,
    }))
  );
  const [loaded, setLoaded] = useState(false);

  const loadOverrides = useCallback(async () => {
    const fields = ["src", "year", "volume", "issue", "caption"] as const;
    const updates: Record<string, Partial<Record<string, string>>> = {};

    await Promise.all(
      archiveItems.flatMap((item) =>
        fields.map((field) =>
          fetch(`/api/content?key=${encodeURIComponent(`archive-${field}-${item.id}`)}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.value !== null && data.value !== undefined) {
                if (!updates[item.id]) updates[item.id] = {};
                updates[item.id][field] = data.value;
              }
            })
            .catch(() => {})
        )
      )
    );

    setDisplayItems(
      archiveItems.map((item) => {
        const overrides = updates[item.id] || {};
        return {
          ...item,
          displaySrc: overrides.src || item.src,
          displayYear: overrides.year || String(item.year),
          displayVolume: overrides.volume || String(item.volume),
          displayIssue: overrides.issue || String(item.issue),
          displayCaption: overrides.caption || item.caption,
        };
      })
    );
    setLoaded(true);
  }, []);

  useEffect(() => {
    loadOverrides();
  }, [loadOverrides]);

  const filtered = activeYear
    ? displayItems.filter((item) => item.displayYear === String(activeYear))
    : displayItems;

  const editingItem = editingId
    ? archiveItems.find((i) => i.id === editingId)
    : null;

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
            className={`group relative transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          >
            <div
              className="overflow-hidden bg-cream-dark cursor-pointer"
              onClick={() => setLightboxItem(item)}
            >
              <Image
                src={item.displaySrc}
                alt={item.displayCaption}
                width={800}
                height={600}
                className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="mt-3">
              <p className="text-xs tracking-widest uppercase text-ink-muted">
                {item.displayYear} · Vol. {item.displayVolume}, No. {item.displayIssue}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink-light line-clamp-2">
                {item.displayCaption}
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(item.id);
                }}
                className="absolute top-2 right-2 bg-accent text-cream text-[10px] px-2 py-1 rounded tracking-wide opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Edit
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />

      {/* Edit modal */}
      {editingItem && (
        <EditEntryModal
          entryId={editingItem.id}
          defaults={{
            src: editingItem.src,
            year: String(editingItem.year),
            volume: String(editingItem.volume),
            issue: String(editingItem.issue),
            caption: editingItem.caption,
          }}
          onClose={() => setEditingId(null)}
          onSaved={loadOverrides}
        />
      )}
    </>
  );
}
