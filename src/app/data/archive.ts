export interface ArchiveItem {
  id: string;
  src: string;
  year: number;
  volume: number;
  issue: number;
  caption: string;
}

export const archiveItems: ArchiveItem[] = [
  {
    id: "1965-v1-i1",
    src: "/images/archive/1965/1.svg",
    year: 1965,
    volume: 1,
    issue: 1,
    caption:
      "The founding editorial board captured in the inaugural issue. A moment of optimism and intent.",
  },
];

export const years = [...new Set(archiveItems.map((item) => item.year))].sort();
