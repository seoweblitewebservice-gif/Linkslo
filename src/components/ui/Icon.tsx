import type { SVGProps } from "react";

export type GlyphName =
  | "link"
  | "quill"
  | "megaphone"
  | "badge"
  | "pin"
  | "document"
  | "gauge"
  | "compass"
  | "shield"
  | "target"
  | "layers"
  | "chart"
  | "globe"
  | "spark"
  | "users"
  | "clock"
  | "filter"
  | "check"
  | "search"
  | "arrow-right"
  | "arrow-up-right"
  | "menu"
  | "close"
  | "chevron-down"
  | "star"
  | "mail"
  | "quote"
  | "sliders"
  | "wallet"
  | "play";

const GLYPHS: Record<GlyphName, React.ReactNode> = {
  link: (
    <>
      <path d="M10.4 13.6a3.8 3.8 0 0 0 5.38 0l3.1-3.1a3.8 3.8 0 1 0-5.38-5.38l-1.4 1.4" />
      <path d="M13.6 10.4a3.8 3.8 0 0 0-5.38 0l-3.1 3.1a3.8 3.8 0 1 0 5.38 5.38l1.4-1.4" />
    </>
  ),
  quill: (
    <>
      <path d="M4 20.5 8 19.5 18.4 9.1a2.55 2.55 0 0 0-3.6-3.6L4.4 15.9 4 20.5Z" />
      <path d="M13.6 6.7 17.2 10.3" />
    </>
  ),
  megaphone: (
    <>
      <path d="M4 10.2v3.6a1 1 0 0 0 1 1h2.2l6.6 4.2V5L7.2 9.2H5a1 1 0 0 0-1 1Z" />
      <path d="M17.6 9a4.2 4.2 0 0 1 0 6" />
      <path d="M7.4 15v4.2" />
    </>
  ),
  badge: (
    <>
      <circle cx="12" cy="9.5" r="5.5" />
      <path d="m8.4 14.2-1.3 6.3 4.9-2.4 4.9 2.4-1.3-6.3" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6.8-6.2 6.8-10.8a6.8 6.8 0 1 0-13.6 0C5.2 14.8 12 21 12 21Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  document: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 16a8 8 0 1 1 16 0" />
      <path d="M12 16 16 10.6" />
      <circle cx="12" cy="16" r="1.3" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15.4 8.6-2 4.8-4.8 2 2-4.8 4.8-2Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.2 19 6v5.2c0 4.4-2.9 7.9-7 9.6-4.1-1.7-7-5.2-7-9.6V6l7-2.8Z" />
      <path d="m9.2 12 2 2 3.6-3.8" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <circle cx="12" cy="12" r="4.6" />
      <circle cx="12" cy="12" r="1.2" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3.4 8.2 4.2L12 11.8 3.8 7.6 12 3.4Z" />
      <path d="m4.4 12 7.6 3.9 7.6-3.9" />
      <path d="m4.4 16.2 7.6 3.9 7.6-3.9" />
    </>
  ),
  chart: (
    <>
      <path d="M4 4v15a1 1 0 0 0 1 1h15" />
      <path d="m7.5 15.4 3.4-4.2 3 2.4 4.6-6" />
      <circle cx="18.5" cy="7.6" r="1.2" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M3.6 12h16.8" />
      <path d="M12 3.6c2.2 2.4 3.4 5.3 3.4 8.4S14.2 18 12 20.4C9.8 18 8.6 15.1 8.6 12S9.8 6 12 3.6Z" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3.4 13.9 9 19.6 11 13.9 13 12 18.6 10.1 13 4.4 11 10.1 9 12 3.4Z" />
      <path d="M18.6 17.2 19.4 19.4 21.6 20.2 19.4 21 18.6 23.2" />
    </>
  ),
  users: (
    <>
      <circle cx="9.4" cy="8.4" r="3.2" />
      <path d="M3.6 19.4a5.8 5.8 0 0 1 11.6 0" />
      <path d="M16 5.6a3.2 3.2 0 0 1 0 5.9" />
      <path d="M17.6 14.2a5.8 5.8 0 0 1 2.8 5.2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.4" />
      <path d="M12 7.4V12l3.1 1.9" />
    </>
  ),
  filter: (
    <>
      <path d="M4 5.6h16l-6.2 7.1v5.9l-3.6 1.8v-7.7L4 5.6Z" />
    </>
  ),
  check: <path d="m5 12.6 4.4 4.4L19 7.4" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.6" />
      <path d="m16 16 4 4" />
    </>
  ),
  "arrow-right": (
    <>
      <path d="M4.6 12h14.2" />
      <path d="m13 6.2 5.8 5.8-5.8 5.8" />
    </>
  ),
  "arrow-up-right": (
    <>
      <path d="M7 17 17 7" />
      <path d="M8.6 7H17v8.4" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h11" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  "chevron-down": <path d="m6 9.5 6 6 6-6" />,
  star: <path d="m12 3.6 2.6 5.5 5.9.8-4.3 4.2 1.1 5.9L12 17.2 6.7 20l1.1-5.9-4.3-4.2 5.9-.8L12 3.6Z" />,
  mail: (
    <>
      <rect x="3.2" y="5.4" width="17.6" height="13.2" rx="2.4" />
      <path d="m4.2 7.4 7.8 5.4 7.8-5.4" />
    </>
  ),
  quote: (
    <>
      <path d="M9.6 6.4C6.6 7.6 5 10 5 13.2c0 2.7 1.5 4.4 3.6 4.4 1.9 0 3.3-1.3 3.3-3.2 0-1.8-1.2-3.1-2.9-3.1-.3 0-.6 0-.8.1.3-1.5 1.3-2.6 2.9-3.4Z" />
      <path d="M19 6.4c-3 1.2-4.6 3.6-4.6 6.8 0 2.7 1.5 4.4 3.6 4.4 1.9 0 3.3-1.3 3.3-3.2 0-1.8-1.2-3.1-2.9-3.1-.3 0-.6 0-.8.1.3-1.5 1.3-2.6 2.9-3.4Z" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 8h10M18 8h2M4 16h4M12 16h8" />
      <circle cx="16" cy="8" r="2" />
      <circle cx="10" cy="16" r="2" />
    </>
  ),
  wallet: (
    <>
      <rect x="3.4" y="6" width="17.2" height="12.4" rx="2.6" />
      <path d="M3.4 10h17.2" />
      <circle cx="16.6" cy="14.2" r="1.1" />
    </>
  ),
  play: <path d="M9 6.6 18 12l-9 5.4V6.6Z" />,
};

type IconProps = SVGProps<SVGSVGElement> & {
  name: GlyphName;
  size?: number;
  filled?: boolean;
};

export function Icon({ name, size = 20, filled = false, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {GLYPHS[name]}
    </svg>
  );
}
