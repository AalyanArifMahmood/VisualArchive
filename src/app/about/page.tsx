"use client";

import EditableText from "../components/EditableText";

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <EditableText
        contentKey="about-title"
        defaultValue="About"
        as="h1"
        className="text-4xl font-light tracking-tight mb-8"
      />

      <div className="space-y-6 text-ink-light leading-relaxed">
        <EditableText
          contentKey="about-description"
          defaultValue="The Visual Archive is a digital preservation project dedicated to collecting, cataloging, and making accessible a growing body of historical visual material. Our holdings span from the mid-1960s to the early 1980s, encompassing photographs, editorial illustrations, and documentary images drawn from institutional publications. Each item in the archive has been carefully digitized and annotated with its year of publication, volume and issue number, and a brief contextual description. The collection is organized chronologically, allowing researchers and casual visitors alike to trace visual narratives across decades. This project was born from a recognition that visual records — often treated as secondary to textual sources — carry their own irreplaceable historical weight. A photograph of a campus quad, a portrait of a faculty member, or a snapshot from a student gathering can convey what written accounts cannot: the texture of a particular moment in time. The archive is an ongoing effort. New material is added as it is discovered, verified, and digitized. If you have material that may be relevant to this collection, or if you would like to learn more about our preservation methods, we welcome your inquiry."
          multiline
        />
      </div>
    </div>
  );
}
