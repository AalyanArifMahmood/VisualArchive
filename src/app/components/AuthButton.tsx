"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <span className="text-cream/50 text-xs tracking-widest uppercase">
        ...
      </span>
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-cream/60 text-xs tracking-wide hidden sm:inline">
          {session.user.email}
        </span>
        <button
          onClick={() => signOut()}
          className="text-cream/70 hover:text-cream transition-colors text-xs tracking-widest uppercase"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="text-cream/70 hover:text-cream transition-colors text-xs tracking-widest uppercase"
    >
      Sign In
    </button>
  );
}
