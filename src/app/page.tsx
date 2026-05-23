"use client";

import Link from "next/link";
import Image from "next/image";
import EditableText from "./components/EditableText";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <section className="flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <EditableText
            contentKey="home-title"
            defaultValue="Preserving Visual History"
            as="h1"
            className="text-4xl font-light tracking-tight mb-6"
          />
          <EditableText
            contentKey="home-description"
            defaultValue="The Visual Archive is a curated digital collection spanning decades of institutional memory. From editorial portraits to campus landscapes, each image captures a moment in time — carefully preserved and made accessible for researchers, students, and anyone drawn to the stories of the past."
            as="p"
            className="text-lg leading-relaxed text-ink-light max-w-2xl"
            multiline
          />
          <Link
            href="/archive"
            className="inline-block mt-8 text-sm tracking-widest uppercase text-accent hover:text-accent-hover transition-colors border-b border-accent pb-1"
          >
            Browse the Collection →
          </Link>
        </div>
        <div className="flex-shrink-0">
          <Image
            src="/images/tehzeeb-niswan.jpg"
            alt="Tehzeeb-e-Niswan cover illustration"
            width={350}
            height={500}
            className="rounded shadow-lg"
            priority
          />
        </div>
      </section>
    </div>
  );
}
