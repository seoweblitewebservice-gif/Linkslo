"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type MeUser = { id: string; name: string; email: string } | null;

/** Header auth state: "Sign in" for guests, avatar menu link for buyers. */
export function AuthNav() {
  const [user, setUser] = useState<MeUser | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setUser((data?.user as MeUser) ?? null);
      })
      .catch(() => {
        /* stay signed-out on error */
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loaded) return null;

  if (!user) {
    return (
      <Link
        href="/login"
        className="hidden h-10 items-center rounded-xl px-4 text-[0.84rem] font-semibold text-ink-700 transition-colors hover:bg-ink-50 sm:inline-flex"
      >
        Sign in
      </Link>
    );
  }

  const initial = (user.name || user.email).trim().charAt(0).toUpperCase() || "?";
  return (
    <Link
      href="/dashboard"
      className="hidden h-10 items-center gap-2 rounded-xl border border-line bg-white pl-1.5 pr-3 transition-colors hover:border-ink-300 sm:inline-flex"
      title="Your dashboard"
    >
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-700 text-[0.72rem] font-bold text-white">
        {initial}
      </span>
      <span className="max-w-[7rem] truncate text-[0.82rem] font-semibold text-ink-800">
        {user.name.split(" ")[0] || "Account"}
      </span>
    </Link>
  );
}
