"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import { useEffect, useRef, useState } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  className?: string;
}

const FONT_OPTIONS = [
  { label: "Default", value: "" },
  { label: "Serif", value: "Georgia, serif" },
  { label: "Sans-serif", value: "Arial, sans-serif" },
  { label: "Monospace", value: "monospace" },
  { label: "Cursive", value: "'Brush Script MT', cursive" },
];

const COLOR_PRESETS = [
  "#B22222", "#1E1410", "#4A3828", "#8B7B6B", "#3A2A1E",
  "#000000", "#374151", "#6b7280", "#991b1b", "#9a3412",
  "#854d0e", "#166534", "#1e40af", "#5b21b6", "#9d174d",
];

function ToolbarButton({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-2 py-1 text-sm rounded transition-colors ${
        active
          ? "bg-sepia text-cream"
          : "text-ink-muted hover:bg-cream-dark hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  content,
  onChange,
  className = "",
}: RichTextEditorProps) {
  const [showColors, setShowColors] = useState(false);
  const [hexInput, setHexInput] = useState("");
  const colorRef = useRef<HTMLDivElement>(null);
  const savedSelection = useRef<{ from: number; to: number } | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontFamily,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none focus:outline-none min-h-[80px] px-3 py-2 text-ink",
      },
    },
  });

  // Close color picker on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) {
        setShowColors(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (!editor) return null;

  const saveSelection = () => {
    const { from, to } = editor.state.selection;
    savedSelection.current = { from, to };
  };

  const applyHexColor = () => {
    if (/^[0-9a-fA-F]{3,6}$/.test(hexInput)) {
      const sel = savedSelection.current;
      if (sel && sel.from !== sel.to) {
        editor.chain().focus().setTextSelection(sel).setColor(`#${hexInput}`).run();
      } else {
        // No selection — apply to all content
        editor.chain().focus().selectAll().setColor(`#${hexInput}`).run();
      }
      setShowColors(false);
      setHexInput("");
    }
  };

  return (
    <div className={`border border-border rounded ${className}`}>
      {/* Toolbar */}
      <div className="relative flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-cream-dark border-b border-border">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Strikethrough"
        >
          <s>S</s>
        </ToolbarButton>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Font family */}
        <select
          value={
            FONT_OPTIONS.find((f) =>
              f.value ? editor.isActive("textStyle", { fontFamily: f.value }) : false
            )?.value ?? ""
          }
          onChange={(e) => {
            if (e.target.value) {
              editor.chain().focus().setFontFamily(e.target.value).run();
            } else {
              editor.chain().focus().unsetFontFamily().run();
            }
          }}
          className="text-xs px-1.5 py-1 bg-cream border border-border rounded text-ink focus:outline-none focus:border-accent"
          title="Font Family"
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Color picker */}
        <div className="relative" ref={colorRef}>
          <ToolbarButton
            onClick={() => { saveSelection(); setShowColors(!showColors); }}
            title="Text Color"
          >
            <span className="flex flex-col items-center leading-none">
              A
              <span
                className="block w-4 h-1 mt-0.5 rounded-sm"
                style={{
                  backgroundColor:
                    (editor.getAttributes("textStyle").color as string) ||
                    "#000000",
                }}
              />
            </span>
          </ToolbarButton>
          {showColors && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-cream border border-border rounded shadow-lg z-50 w-48">
              <div className="grid grid-cols-5 gap-1">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      if (savedSelection.current) {
                        editor.chain().focus().setTextSelection(savedSelection.current).setColor(color).run();
                      } else {
                        editor.chain().focus().setColor(color).run();
                      }
                      setShowColors(false);
                    }}
                    className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <div className="mt-2 flex items-center gap-1">
                <span className="text-xs text-ink-muted">#</span>
                <input
                  type="text"
                  value={hexInput}
                  onChange={(e) => setHexInput(e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6))}
                  onMouseDown={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyHexColor();
                    }
                  }}
                  placeholder="hex value"
                  className="flex-1 text-xs px-1.5 py-1 bg-cream-dark border border-border rounded text-ink focus:outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    applyHexColor();
                  }}
                  className="text-xs px-1.5 py-1 bg-cream-dark border border-border rounded text-ink hover:bg-border transition-colors"
                >
                  ✓
                </button>
              </div>
              <div className="mt-2">
                <input
                  type="color"
                  onChange={(e) => {
                    if (savedSelection.current) {
                      editor.chain().focus().setTextSelection(savedSelection.current).setColor(e.target.value).run();
                    } else {
                      editor.chain().focus().setColor(e.target.value).run();
                    }
                    setShowColors(false);
                  }}
                  className="w-full h-6 cursor-pointer rounded"
                  title="Color picker"
                />
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-border mx-1" />

        {/* Clear formatting */}
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          title="Clear Formatting"
        >
          ✕
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div className="bg-cream">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
