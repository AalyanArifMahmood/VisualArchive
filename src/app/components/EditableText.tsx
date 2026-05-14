"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";

const ADMIN_EMAIL = "aalyanarif875@gmail.com";

interface EditableTextProps {
  contentKey: string;
  defaultValue: string;
  as?: "p" | "h1" | "span";
  className?: string;
  multiline?: boolean;
}

export default function EditableText({
  contentKey,
  defaultValue,
  as: Tag = "p",
  className = "",
  multiline = false,
}: EditableTextProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.email === ADMIN_EMAIL;

  const [value, setValue] = useState(defaultValue);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  // Load saved content on mount
  useEffect(() => {
    fetch(`/api/content?key=${encodeURIComponent(contentKey)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.value !== undefined && data.value !== null) {
          setValue(data.value);
        }
      })
      .catch(() => {});
  }, [contentKey]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: contentKey, value }),
      });
    } catch {
      // Revert on error
      setValue(defaultValue);
    }
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    // Reload saved value
    fetch(`/api/content?key=${encodeURIComponent(contentKey)}`)
      .then((res) => res.json())
      .then((data) => {
        setValue(data.value ?? defaultValue);
      })
      .catch(() => setValue(defaultValue));
  };

  if (!isAdmin) {
    return <Tag className={className}>{value}</Tag>;
  }

  if (editing) {
    return (
      <div className="relative">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={`${className} w-full bg-cream-dark border border-accent/40 px-2 py-1 rounded focus:outline-none focus:border-accent resize-y`}
            rows={4}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCancel();
              if (e.key === "Enter" && e.ctrlKey) handleSave();
            }}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={`${className} w-full bg-cream-dark border border-accent/40 px-2 py-1 rounded focus:outline-none focus:border-accent`}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCancel();
              if (e.key === "Enter") handleSave();
            }}
          />
        )}
        <div className="flex gap-2 mt-1">
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-xs px-3 py-1 bg-accent text-cream rounded hover:bg-accent-hover transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleCancel}
            className="text-xs px-3 py-1 border border-border text-ink-muted rounded hover:text-ink transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group/edit relative cursor-pointer"
      onClick={() => setEditing(true)}
    >
      <Tag className={className}>{value}</Tag>
      <span className="invisible group-hover/edit:visible absolute -top-2 -right-2 bg-accent text-cream text-[10px] px-1.5 py-0.5 rounded tracking-wide">
        Edit
      </span>
    </div>
  );
}
