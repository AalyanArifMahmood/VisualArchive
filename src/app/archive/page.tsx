import ArchiveGrid from "../components/ArchiveGrid";

export const metadata = {
  title: "Archive — The Visual Archive",
  description: "Browse the full collection by year.",
};

export default function ArchivePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-light tracking-tight mb-3">Archive</h1>
      <p className="text-ink-light mb-10 max-w-xl">
        Browse the collection below. Use the year filters to narrow your search,
        and click any image to view it in detail.
      </p>
      <ArchiveGrid />
    </div>
  );
}
