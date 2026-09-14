import Link from "next/link";
import { BRAND } from "@/lib/content";

export function LogoMark({ size = 36, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="linkslo-mark" x1="4" y1="36" x2="36" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#076A54" />
          <stop offset="0.55" stopColor="#16A37C" />
          <stop offset="1" stopColor="#3DBD95" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="url(#linkslo-mark)" />
      {/* Interlocking chain links — the "link" in Linkslo */}
      <rect x="7.5" y="14.5" width="15" height="11" rx="5.5" transform="rotate(-45 15 20)" stroke="#fff" strokeWidth="2.6" strokeOpacity="0.96" />
      <rect x="17.5" y="14.5" width="15" height="11" rx="5.5" transform="rotate(-45 25 20)" stroke="#fff" strokeWidth="2.6" strokeOpacity="0.96" />
      <circle cx="30.2" cy="10.4" r="2.4" fill="#D4F5E6" />
    </svg>
  );
}

export function Logo({
  className = "",
  compact = false,
  onClick,
}: {
  className?: string;
  compact?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={`group inline-flex items-center gap-2.5 rounded-xl ${className}`}
      aria-label={`${BRAND.name} home`}
    >
      <LogoMark size={compact ? 32 : 36} className="transition-transform duration-300 group-hover:-rotate-3" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.12rem] font-semibold tracking-tight text-ink-950">
          {BRAND.name}
        </span>
        {!compact && (
          <span className="mt-0.5 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-ink-400">
            Backlink Marketplace
          </span>
        )}
      </span>
    </Link>
  );
}
