export const metadata = {
  title: "About — The Visual Archive",
  description: "About this digital archive project.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-light tracking-tight mb-8">About</h1>

      <div className="space-y-6 text-ink-light leading-relaxed">
        <p>
          The Visual Archive is a digital preservation project dedicated to
          collecting, cataloging, and making accessible a growing body of
          historical visual material. Our holdings span from the mid-1960s to the
          early 1980s, encompassing photographs, editorial illustrations, and
          documentary images drawn from institutional publications.
        </p>

        <p>
          Each item in the archive has been carefully digitized and annotated
          with its year of publication, volume and issue number, and a brief
          contextual description. The collection is organized chronologically,
          allowing researchers and casual visitors alike to trace visual
          narratives across decades.
        </p>

        <p>
          This project was born from a recognition that visual records — often
          treated as secondary to textual sources — carry their own irreplaceable
          historical weight. A photograph of a campus quad, a portrait of a
          faculty member, or a snapshot from a student gathering can convey what
          written accounts cannot: the texture of a particular moment in time.
        </p>

        <p>
          The archive is an ongoing effort. New material is added as it is
          discovered, verified, and digitized. If you have material that may be
          relevant to this collection, or if you would like to learn more about
          our preservation methods, we welcome your inquiry.
        </p>

        <p className="text-sm text-ink-muted pt-4 border-t border-border">
          For questions or contributions, please contact us at{" "}
          <span className="text-accent">archive@example.com</span>
        </p>
      </div>
    </div>
  );
}
