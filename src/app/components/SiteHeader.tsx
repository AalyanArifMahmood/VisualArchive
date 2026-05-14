"use client";

import Link from "next/link";
import EditableText from "./EditableText";
import AuthButton from "./AuthButton";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-sepia">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="text-2xl tracking-wide font-light text-cream hover:text-accent transition-colors">
          <EditableText
            contentKey="site-title"
            defaultValue="The Visual Archive"
            as="span"
            className="text-2xl tracking-wide font-light"
          />
        </Link>
        <nav className="flex gap-8 text-sm tracking-widest uppercase">
          <Link href="/" className="text-cream/70 hover:text-cream transition-colors">
            Home
          </Link>
          <Link href="/archive" className="text-cream/70 hover:text-cream transition-colors">
            Archive
          </Link>
          <Link href="/about" className="text-cream/70 hover:text-cream transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-cream/70 hover:text-cream transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
