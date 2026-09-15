"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

type ActivityItem = {
  id: number;
  slug: string;
  domain: string;
  price: number;
  buyerName: string;
  buyerLocation: string;
  minutesAgo: number;
};

const SHOW_AFTER_MS = 3000;
const VISIBLE_FOR_MS = 5000;
const GAP_BETWEEN_MS = 5000;

/**
 * Small, dismissible "recent activity" toast in the bottom-left corner.
 * Cycles through real, currently-listed gigs pulled from /api/activity —
 * the product and price shown are always real; only the buyer name,
 * location and elapsed time are randomised, not a claim of a verified sale.
 */
export function ActivityNotifications() {
  const pathname = usePathname();
  const hideOnThisPage =
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/order") ||
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/signup");

  const [queue, setQueue] = useState<ActivityItem[]>([]);
  const [current, setCurrent] = useState<ActivityItem | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissedForSession, setDismissedForSession] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/activity")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data?.ok && Array.isArray(data.items)) {
          setQueue(data.items);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (dismissedForSession || queue.length === 0) return;
    let showTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;

    const cycle = (delay: number) => {
      showTimer = setTimeout(() => {
        setCurrent(queue[indexRef.current % queue.length]);
        indexRef.current += 1;
        setVisible(true);
        hideTimer = setTimeout(() => {
          setVisible(false);
          cycle(GAP_BETWEEN_MS);
        }, VISIBLE_FOR_MS);
      }, delay);
    };

    cycle(SHOW_AFTER_MS);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [queue, dismissedForSession]);

  if (dismissedForSession || !current || hideOnThisPage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 left-4 z-30 max-w-[19rem] transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <div className="flex items-start gap-3 rounded-2xl border border-line bg-white p-3.5 shadow-lg">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <Icon name="check" size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[0.8rem] leading-snug text-ink-800">
            <span className="font-semibold">{current.buyerName}</span> from {current.buyerLocation} ordered a guest
            post on <span className="font-semibold">{current.domain}</span>
          </p>
          <div className="mt-1 flex items-center gap-2 text-[0.7rem] text-ink-400">
            <span>{current.minutesAgo} min ago</span>
            <span>·</span>
            <span>${current.price}</span>
            <span>·</span>
            <Link href={`/marketplace/gigs/${current.slug}`} className="font-medium text-brand-700 hover:underline">
              View gig
            </Link>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setVisible(false);
            setDismissedForSession(true);
          }}
          aria-label="Dismiss notifications"
          className="shrink-0 rounded-full p-1 text-ink-300 transition-colors hover:bg-canvas hover:text-ink-600"
        >
          <Icon name="close" size={14} />
        </button>
      </div>
    </div>
  );
}
