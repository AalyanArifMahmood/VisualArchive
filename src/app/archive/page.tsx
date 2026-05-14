import ArchiveGrid from "../components/ArchiveGrid";
import ArchiveHeader from "../components/ArchiveHeader";

export const metadata = {
  title: "Archive — The Visual Archive",
  description: "Browse the full collection by year.",
};

export default function ArchivePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <ArchiveHeader />
      <ArchiveGrid />
    </div>
  );
}
