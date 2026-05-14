"use client";

import EditableText from "../components/EditableText";

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-light tracking-tight mb-8">Contact</h1>

      <div className="space-y-8">
        <div>
          <EditableText
            contentKey="contact-paragraph"
            defaultValue="We welcome inquiries from researchers, alumni, and anyone interested in contributing to or learning more about the archive. Whether you have material that may be relevant to our collection, questions about specific items, or would simply like to connect — please don't hesitate to reach out."
            as="p"
            className="text-ink-light leading-relaxed"
            multiline
          />
        </div>

        <div className="border-t border-border pt-8 space-y-5">
          <div className="flex items-start gap-4">
            <span className="text-xs tracking-widest uppercase text-ink-muted w-16 pt-0.5 shrink-0">
              Email
            </span>
            <EditableText
              contentKey="contact-email"
              defaultValue="archive@example.com"
              as="p"
              className="text-ink-light"
            />
          </div>

          <div className="flex items-start gap-4">
            <span className="text-xs tracking-widest uppercase text-ink-muted w-16 pt-0.5 shrink-0">
              Phone
            </span>
            <EditableText
              contentKey="contact-phone"
              defaultValue="+1 (555) 000-0000"
              as="p"
              className="text-ink-light"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
