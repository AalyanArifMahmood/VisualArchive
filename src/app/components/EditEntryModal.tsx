"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface EntryData {
  src: string;
  year: string;
  volume: string;
  issue: string;
  caption: string;
}

interface EditEntryModalProps {
  entryId: string;
  defaults: EntryData;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditEntryModal({
  entryId,
  defaults,
  onClose,
  onSaved,
}: EditEntryModalProps) {
  const [form, setForm] = useState<EntryData>(defaults);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(defaults.src);

  // Load saved values on mount
  useEffect(() => {
    const fields = ["src", "year", "volume", "issue", "caption"] as const;
    Promise.all(
      fields.map((field) =>
        fetch(`/api/content?key=${encodeURIComponent(`archive-${field}-${entryId}`)}`)
          .then((res) => res.json())
          .then((data) => ({ field, value: data.value }))
      )
    ).then((results) => {
      const updates: Partial<EntryData> = {};
      for (const { field, value } of results) {
        if (value !== null && value !== undefined) {
          updates[field] = value;
        }
      }
      if (Object.keys(updates).length > 0) {
        setForm((prev) => ({ ...prev, ...updates }));
        if (updates.src) setImagePreview(updates.src);
      }
    });
  }, [entryId]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleSave = async () => {
    setSaving(true);
    const fields = ["src", "year", "volume", "issue", "caption"] as const;
    try {
      await Promise.all(
        fields.map((field) =>
          fetch("/api/content", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              key: `archive-${field}-${entryId}`,
              value: form[field],
            }),
          })
        )
      );
      onSaved();
      onClose();
    } catch {
      // Error handling
    }
    setSaving(false);
  };

  const handleChange = (field: keyof EntryData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "src") setImagePreview(value);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full bg-cream p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-ink-muted hover:text-ink transition-colors text-xl"
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-xl font-light tracking-tight mb-6">Edit Entry</h2>

        <div className="space-y-5">
          {/* Image preview */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-ink-muted mb-2">
              Image URL
            </label>
            <input
              type="text"
              value={form.src}
              onChange={(e) => handleChange("src", e.target.value)}
              className="w-full px-3 py-2 bg-cream-dark border border-border text-ink text-sm rounded focus:outline-none focus:border-accent transition-colors"
            />
            {imagePreview && (
              <div className="mt-2 bg-cream-dark p-2 overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={400}
                  height={300}
                  className="w-full h-auto"
                />
              </div>
            )}
          </div>

          {/* Year, Volume, Issue in a row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs tracking-widest uppercase text-ink-muted mb-2">
                Year
              </label>
              <input
                type="text"
                value={form.year}
                onChange={(e) => handleChange("year", e.target.value)}
                className="w-full px-3 py-2 bg-cream-dark border border-border text-ink text-sm rounded focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-ink-muted mb-2">
                Volume
              </label>
              <input
                type="text"
                value={form.volume}
                onChange={(e) => handleChange("volume", e.target.value)}
                className="w-full px-3 py-2 bg-cream-dark border border-border text-ink text-sm rounded focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase text-ink-muted mb-2">
                Issue
              </label>
              <input
                type="text"
                value={form.issue}
                onChange={(e) => handleChange("issue", e.target.value)}
                className="w-full px-3 py-2 bg-cream-dark border border-border text-ink text-sm rounded focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-ink-muted mb-2">
              Caption
            </label>
            <textarea
              value={form.caption}
              onChange={(e) => handleChange("caption", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-cream-dark border border-border text-ink text-sm rounded focus:outline-none focus:border-accent transition-colors resize-y"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 bg-sepia text-cream text-sm tracking-widest uppercase hover:bg-ink transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-border text-ink-muted text-sm tracking-widest uppercase hover:text-ink transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
