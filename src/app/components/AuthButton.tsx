"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (session?.user) {
    return (
      <button
        onClick={() => signOut()}
        className="text-cream/40 hover:text-cream/70 transition-colors text-xs tracking-widest uppercase"
      >
        Admin Logout
      </button>
    );
  }

  return (
    <Link
      href="/login"
      className="text-cream/40 hover:text-cream/70 transition-colors text-xs tracking-widest uppercase"
    >
      Admin
    </Link>
  );
}
