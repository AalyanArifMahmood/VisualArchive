"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("./RichTextEditor"), { ssr: false });

const ADMIN_EMAILS = [
  "aalyanarif875@gmail.com",
  "mahnoorlali1@gmail.com",
];

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
}: EditableTextProps) {
  const { data: session } = useSession();
  const isAdmin = !!session?.user?.email && ADMIN_EMAILS.includes(session.user.email);

  const [value, setValue] = useState(defaultValue);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [draftValue, setDraftValue] = useState(defaultValue);

  // Load saved content on mount
  useEffect(() => {
    fetch(`/api/content?key=${encodeURIComponent(contentKey)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.value !== undefined && data.value !== null) {
          setValue(data.value);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [contentKey]);

  const handleEdit = () => {
    setDraftValue(value);
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: contentKey, value: draftValue }),
      });
      setValue(draftValue);
    } catch {
      // Revert on error
    }
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setDraftValue(value);
  };

  // Check if content contains HTML tags
  const isHtml = (str: string) => /<[a-z][\s\S]*>/i.test(str);

  if (!isAdmin) {
    return isHtml(value) ? (
      <Tag
        className={`${className} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    ) : (
      <Tag
        className={`${className} transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      >
        {value}
      </Tag>
    );
  }

  if (editing) {
    return (
      <div className="relative">
        <RichTextEditor
          content={draftValue}
          onChange={setDraftValue}
        />
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
      className={`group/edit relative cursor-pointer transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      onClick={handleEdit}
    >
      {isHtml(value) ? (
        <Tag className={className} dangerouslySetInnerHTML={{ __html: value }} />
      ) : (
        <Tag className={className}>{value}</Tag>
      )}
      <span className="invisible group-hover/edit:visible absolute -top-2 -right-2 bg-accent text-cream text-[10px] px-1.5 py-0.5 rounded tracking-wide">
        Edit
      </span>
    </div>
  );
}
