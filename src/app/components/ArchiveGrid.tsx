"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { archiveItems } from "../data/archive";
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
  isCustom: boolean;
}

export default function ArchiveGrid() {
  const { data: session } = useSession();
  const isAdmin = !!session?.user?.email && ADMIN_EMAILS.includes(session.user.email);

  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [yearSearch, setYearSearch] = useState("");
  const [lightboxItem, setLightboxItem] = useState<ArchiveItem | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addingEntry, setAddingEntry] = useState(false);
  const [displayItems, setDisplayItems] = useState<DisplayItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const loadAllItems = useCallback(async () => {
    // Load overrides for static items
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

    // Check which static items are deleted
    const deletedChecks = await Promise.all(
      archiveItems.map((item) =>
        fetch(`/api/content?key=${encodeURIComponent(`archive-deleted-${item.id}`)}`)
          .then((res) => res.json())
          .then((data) => ({ id: item.id, deleted: data.value === "true" }))
          .catch(() => ({ id: item.id, deleted: false }))
      )
    );
    const deletedIds = new Set(deletedChecks.filter((d) => d.deleted).map((d) => d.id));

    const staticItems: DisplayItem[] = archiveItems
      .filter((item) => !deletedIds.has(item.id))
      .map((item) => {
        const overrides = updates[item.id] || {};
        return {
          ...item,
          displaySrc: overrides.src || item.src,
          displayYear: overrides.year || String(item.year),
          displayVolume: overrides.volume || String(item.volume),
          displayIssue: overrides.issue || String(item.issue),
          displayCaption: overrides.caption || item.caption,
          isCustom: false,
        };
      });

    // Load custom entries
    let customItems: DisplayItem[] = [];
    try {
      const res = await fetch("/api/entries");
      const data = await res.json();
      customItems = (data.entries || []).map((entry: Record<string, string>) => ({
        id: entry.id,
        src: entry.src || "/images/hero-1.svg",
        year: parseInt(entry.year) || 0,
        volume: parseInt(entry.volume) || 0,
        issue: parseInt(entry.issue) || 0,
        caption: entry.caption || "",
        displaySrc: entry.src || "/images/hero-1.svg",
        displayYear: entry.year || "0",
        displayVolume: entry.volume || "0",
        displayIssue: entry.issue || "0",
        displayCaption: entry.caption || "",
        isCustom: true,
      }));
    } catch {}

    setDisplayItems([...staticItems, ...customItems]);
    setLoaded(true);
  }, []);

  useEffect(() => {
    loadAllItems();
  }, [loadAllItems]);

  const handleDelete = async (item: DisplayItem) => {
    const confirmMsg = item.isCustom
      ? "Delete this entry permanently?"
      : "Hide this entry? (It can be restored by removing its override)";
    if (!confirm(confirmMsg)) return;

    if (item.isCustom) {
      await fetch("/api/entries", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id }),
      });
    } else {
      // For static items, mark as deleted in Redis
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: `archive-deleted-${item.id}`, value: "true" }),
      });
    }
    loadAllItems();
  };

  const filtered = displayItems
    .filter((item) =>
      yearSearch ? item.displayYear.includes(yearSearch) : true
    )
    .sort((a, b) =>
      sortOrder === "newest"
        ? parseInt(b.displayYear) - parseInt(a.displayYear)
        : parseInt(a.displayYear) - parseInt(b.displayYear)
    );

  // Find the item being edited (static or custom)
  const editingItem = editingId
    ? displayItems.find((i) => i.id === editingId)
    : null;

  return (
    <>
      {/* Sort and search controls */}
      <div className="flex flex-wrap items-center gap-4 mb-10">
        <div className="flex items-center gap-2">
          <label className="text-xs tracking-widest uppercase text-ink-muted">
            Sort
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
            className="px-3 py-2 text-xs tracking-wide bg-cream-dark border border-border text-ink rounded focus:outline-none focus:border-accent transition-colors"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs tracking-widest uppercase text-ink-muted">
            Year
          </label>
          <input
            type="text"
            value={yearSearch}
            onChange={(e) => setYearSearch(e.target.value)}
            placeholder="e.g. 1965"
            className="w-28 px-3 py-2 text-xs bg-cream-dark border border-border text-ink rounded focus:outline-none focus:border-accent transition-colors"
          />
        </div>
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
              <div
                className="mt-1 text-sm leading-relaxed text-ink-light line-clamp-2"
                dangerouslySetInnerHTML={{ __html: item.displayCaption }}
              />
            </div>

            {isAdmin && (
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(item.id);
                  }}
                  className="bg-accent text-cream text-[10px] px-2 py-1 rounded tracking-wide"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item);
                  }}
                  className="bg-ink text-cream text-[10px] px-2 py-1 rounded tracking-wide"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add Entry button */}
        {isAdmin && (
          <div
            onClick={() => setAddingEntry(true)}
            className={`flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-accent cursor-pointer transition-colors min-h-[200px] rounded ${loaded ? "opacity-100" : "opacity-0"}`}
          >
            <span className="text-3xl text-ink-muted mb-2">+</span>
            <span className="text-xs tracking-widest uppercase text-ink-muted">
              Add Entry
            </span>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />

      {/* Edit modal */}
      {editingItem && (
        <EditEntryModal
          entryId={editingItem.id}
          defaults={{
            src: editingItem.displaySrc,
            year: editingItem.displayYear,
            volume: editingItem.displayVolume,
            issue: editingItem.displayIssue,
            caption: editingItem.displayCaption,
          }}
          isCustom={editingItem.isCustom}
          onClose={() => setEditingId(null)}
          onSaved={loadAllItems}
        />
      )}

      {/* Add entry modal */}
      {addingEntry && (
        <EditEntryModal
          entryId=""
          defaults={{
            src: "",
            year: "",
            volume: "",
            issue: "",
            caption: "",
          }}
          isCustom={true}
          isNew={true}
          onClose={() => setAddingEntry(false)}
          onSaved={loadAllItems}
        />
      )}
    </>
  );
}
