"use client";

import EditableText from "./EditableText";

export default function ArchiveHeader() {
  return (
    <>
      <EditableText
        contentKey="archive-title"
        defaultValue="Archive"
        as="h1"
        className="text-4xl font-light tracking-tight mb-3"
      />
      <EditableText
        contentKey="archive-description"
        defaultValue="Browse the collection below. Use the year filters to narrow your search, and click any image to view it in detail."
        as="p"
        className="text-ink-light mb-10 max-w-xl"
        multiline
      />
    </>
  );
}
