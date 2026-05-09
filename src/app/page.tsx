import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <section className="mb-16">
        <h1 className="text-4xl font-light tracking-tight mb-6">
          Preserving Visual History
        </h1>
        <p className="text-lg leading-relaxed text-ink-light max-w-2xl">
          The Visual Archive is a curated digital collection spanning decades of
          institutional memory. From editorial portraits to campus landscapes,
          each image captures a moment in time — carefully preserved and made
          accessible for researchers, students, and anyone drawn to the stories
          of the past.
        </p>
        <Link
          href="/archive"
          className="inline-block mt-8 text-sm tracking-widest uppercase text-accent hover:text-accent-hover transition-colors border-b border-accent pb-1"
        >
          Browse the Collection →
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group">
          <div className="overflow-hidden">
            <Image
              src="/images/hero-1.svg"
              alt="Featured collection preview"
              width={900}
              height={500}
              className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
              priority
            />
          </div>
          <p className="mt-3 text-sm text-ink-muted">
            A selection from the early collections, 1965–1970
          </p>
        </div>
        <div className="group">
          <div className="overflow-hidden">
            <Image
              src="/images/hero-2.svg"
              alt="Historical documents preview"
              width={900}
              height={500}
              className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
          <p className="mt-3 text-sm text-ink-muted">
            Documents and photographs from the 1975–1980 period
          </p>
        </div>
      </section>
    </div>
  );
}
