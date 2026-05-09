export interface ArchiveItem {
  id: string;
  src: string;
  year: number;
  volume: number;
  issue: number;
  caption: string;
}

export const archiveItems: ArchiveItem[] = [
  // 1965
  {
    id: "1965-v1-i1",
    src: "/images/archive/1965/1.svg",
    year: 1965,
    volume: 1,
    issue: 1,
    caption:
      "The founding editorial board captured in the inaugural issue. A moment of optimism and intent.",
  },
  {
    id: "1965-v1-i2",
    src: "/images/archive/1965/2.svg",
    year: 1965,
    volume: 1,
    issue: 2,
    caption:
      "Early campus grounds before the east wing expansion. Note the original boundary wall.",
  },
  {
    id: "1965-v1-i3",
    src: "/images/archive/1965/3.svg",
    year: 1965,
    volume: 1,
    issue: 3,
    caption:
      "First student assembly held under open skies. Approximately two hundred attendees.",
  },
  {
    id: "1965-v1-i4",
    src: "/images/archive/1965/4.svg",
    year: 1965,
    volume: 1,
    issue: 4,
    caption:
      "The original reading room with its characteristic arched windows and wooden furnishings.",
  },

  // 1970
  {
    id: "1970-v6-i1",
    src: "/images/archive/1970/1.svg",
    year: 1970,
    volume: 6,
    issue: 1,
    caption:
      "Annual convocation ceremony. The first graduating class of the expanded program.",
  },
  {
    id: "1970-v6-i2",
    src: "/images/archive/1970/2.svg",
    year: 1970,
    volume: 6,
    issue: 2,
    caption:
      "Faculty portrait, Department of History. Several founding members still present.",
  },
  {
    id: "1970-v6-i3",
    src: "/images/archive/1970/3.svg",
    year: 1970,
    volume: 6,
    issue: 3,
    caption:
      "Inter-collegiate sports day. Track and field events drew record participation.",
  },
  {
    id: "1970-v6-i4",
    src: "/images/archive/1970/4.svg",
    year: 1970,
    volume: 6,
    issue: 4,
    caption:
      "Student art exhibition in the main hall. Works ranged from oil paintings to mixed media.",
  },

  // 1975
  {
    id: "1975-v11-i1",
    src: "/images/archive/1975/1.svg",
    year: 1975,
    volume: 11,
    issue: 1,
    caption:
      "Graduation day under monsoon skies. The ceremony continued despite intermittent rain.",
  },
  {
    id: "1975-v11-i2",
    src: "/images/archive/1975/2.svg",
    year: 1975,
    volume: 11,
    issue: 2,
    caption:
      "The newly equipped science laboratory. A significant investment in modernizing facilities.",
  },
  {
    id: "1975-v11-i3",
    src: "/images/archive/1975/3.svg",
    year: 1975,
    volume: 11,
    issue: 3,
    caption:
      "Drama society's annual production. Shakespeare's Twelfth Night adapted for local context.",
  },
  {
    id: "1975-v11-i4",
    src: "/images/archive/1975/4.svg",
    year: 1975,
    volume: 11,
    issue: 4,
    caption:
      "Annual inter-university debate competition. The team placed second nationally.",
  },

  // 1980
  {
    id: "1980-v16-i1",
    src: "/images/archive/1980/1.svg",
    year: 1980,
    volume: 16,
    issue: 1,
    caption:
      "Opening ceremony for the new administrative wing. A decade in planning.",
  },
  {
    id: "1980-v16-i2",
    src: "/images/archive/1980/2.svg",
    year: 1980,
    volume: 16,
    issue: 2,
    caption:
      "Alumni gathering marking fifteen years since the first graduating class.",
  },
  {
    id: "1980-v16-i3",
    src: "/images/archive/1980/3.svg",
    year: 1980,
    volume: 16,
    issue: 3,
    caption:
      "Cultural festival performances. Music, dance, and theatrical acts spanning three days.",
  },
  {
    id: "1980-v16-i4",
    src: "/images/archive/1980/4.svg",
    year: 1980,
    volume: 16,
    issue: 4,
    caption:
      "Annual prize distribution ceremony. Academic excellence and extracurricular achievement recognized.",
  },
];

export const years = [...new Set(archiveItems.map((item) => item.year))].sort();
