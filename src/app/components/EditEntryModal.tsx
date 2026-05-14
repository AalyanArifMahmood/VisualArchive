"use client";

import { useState, useEffect, useRef } from "react";
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
  isCustom?: boolean;
  isNew?: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditEntryModal({
  entryId,
  defaults,
  isCustom = false,
  isNew = false,
  onClose,
  onSaved,
}: EditEntryModalProps) {
  const [form, setForm] = useState<EntryData>(defaults);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState(defaults.src);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved values on mount (only for existing static entries)
  useEffect(() => {
    if (isNew || isCustom) return;

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
  }, [entryId, isNew, isCustom]);

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
    if (!form.src || !form.year || !form.volume || !form.issue || !form.caption) {
      alert("All fields are required.");
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        // Create new entry via entries API
        await fetch("/api/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else if (isCustom) {
        // Update custom entry (POST with existing ID updates in place)
        await fetch("/api/entries", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, id: entryId }),
        });
      } else {
        // Update static entry overrides via content API
        const fields = ["src", "year", "volume", "issue", "caption"] as const;
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
      }
      onSaved();
      onClose();
    } catch {
      alert("Failed to save. Please try again.");
    }
    setSaving(false);
  };

  const handleChange = (field: keyof EntryData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "src") setImagePreview(value);
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, src: data.url }));
        setImagePreview(data.url);
      } else {
        alert(`Upload failed: ${data.error || "Unknown error"}`);
      }
    } catch {
      alert("Upload failed. Please try again.");
    }
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
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

        <h2 className="text-xl font-light tracking-tight mb-6">
          {isNew ? "Add New Entry" : "Edit Entry"}
        </h2>

        <div className="space-y-5">
          {/* Image upload */}
          <div>
            <label className="block text-xs tracking-widest uppercase text-ink-muted mb-2">
              Image
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors ${
                dragOver
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-accent"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              {uploading ? (
                <p className="text-sm text-ink-muted">Uploading...</p>
              ) : imagePreview ? (
                <div className="space-y-2">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={400}
                    height={300}
                    className="w-full h-auto rounded"
                  />
                  <p className="text-xs text-ink-muted">
                    Drop a new image or click to replace
                  </p>
                </div>
              ) : (
                <div className="py-6">
                  <p className="text-sm text-ink-muted">
                    Drop an image here or click to browse
                  </p>
                </div>
              )}
            </div>
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
                placeholder="1965"
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
                placeholder="1"
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
                placeholder="1"
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
              placeholder="Describe this archive entry..."
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
              {saving ? "Saving..." : isNew ? "Add Entry" : "Save Changes"}
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
