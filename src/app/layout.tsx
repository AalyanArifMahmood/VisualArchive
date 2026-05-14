import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import Providers from "./providers";
import AuthButton from "./components/AuthButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Visual Archive",
  description: "A digital archive preserving visual history across decades.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <Providers>
          <header className="sticky top-0 z-40 border-b border-border bg-sepia">
            <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link href="/" className="text-2xl tracking-wide font-light text-cream hover:text-accent transition-colors">
                The Visual Archive
              </Link>
              <nav className="flex gap-8 text-sm tracking-widest uppercase">
                <Link href="/" className="text-cream/70 hover:text-cream transition-colors">
                  Home
                </Link>
                <Link href="/archive" className="text-cream/70 hover:text-cream transition-colors">
                  Archive
                </Link>
                <Link href="/about" className="text-cream/70 hover:text-cream transition-colors">
                  About
                </Link>
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-border mt-auto bg-sepia">
            <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between text-sm text-cream/50">
              <span>© {new Date().getFullYear()} The Visual Archive. All rights reserved.</span>
              <AuthButton />
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
