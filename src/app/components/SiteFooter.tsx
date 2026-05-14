"use client";

import EditableText from "./EditableText";
import AuthButton from "./AuthButton";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border mt-auto bg-sepia">
      <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-cream/50">
        <EditableText
          contentKey="site-footer"
          defaultValue={`© ${new Date().getFullYear()} The Visual Archive. All rights reserved.`}
          as="span"
        />
        <AuthButton />
      </div>
    </footer>
  );
}
