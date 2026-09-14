import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon, type GlyphName } from "@/components/ui/Icon";

/* -------------------------------------------------------------------------- */
/*  Button                                                                     */
/* -------------------------------------------------------------------------- */

type Variant = "primary" | "dark" | "outline" | "ghost" | "soft";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-600 text-white shadow-[0_10px_30px_-12px_rgba(9,131,102,0.75)] hover:bg-brand-700 hover:shadow-[0_16px_38px_-14px_rgba(9,131,102,0.8)]",
  dark: "bg-ink-950 text-white hover:bg-ink-800",
  outline:
    "border border-ink-200 bg-white text-ink-900 hover:border-brand-300 hover:bg-brand-50/60 hover:text-brand-800",
  ghost: "text-ink-700 hover:bg-ink-50 hover:text-ink-950",
  soft: "bg-brand-50 text-brand-800 hover:bg-brand-100",
};

const SIZES: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[0.82rem] gap-1.5 rounded-lg",
  md: "h-11 px-5 text-[0.9rem] gap-2 rounded-xl",
  lg: "h-[3.25rem] px-6 text-[0.95rem] gap-2 rounded-xl",
};

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  href?: string;
  icon?: GlyphName;
  iconLeft?: GlyphName;
  className?: string;
  fullWidth?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  icon,
  iconLeft,
  className = "",
  fullWidth = false,
  ...rest
}: ButtonProps) {
  const classes = [
    "group/btn inline-flex items-center justify-center font-semibold tracking-[-0.01em]",
    "transition-all duration-250 ease-out active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-55",
    VARIANTS[variant],
    SIZES[size],
    fullWidth ? "w-full" : "",
    className,
  ].join(" ");

  const inner = (
    <>
      {iconLeft && <Icon name={iconLeft} size={size === "sm" ? 15 : 17} />}
      <span>{children}</span>
      {icon && (
        <Icon
          name={icon}
          size={size === "sm" ? 15 : 17}
          className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
        />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }

  return (
    <button className={classes} {...rest}>
      {inner}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Surfaces + typography                                                      */
/* -------------------------------------------------------------------------- */

export function Card({
  children,
  className = "",
  hover = false,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "article" | "li" | "section";
}) {
  return (
    <Tag
      className={`rounded-2xl border border-line bg-white shadow-soft ${hover ? "card-hover" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}

export function Eyebrow({
  children,
  icon,
  tone = "brand",
}: {
  children: ReactNode;
  icon?: GlyphName;
  tone?: "brand" | "light";
}) {
  const tones =
    tone === "brand"
      ? "border-brand-200/80 bg-brand-50 text-brand-800"
      : "border-white/15 bg-white/10 text-brand-100 backdrop-blur";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] ${tones}`}
    >
      {icon && <Icon name={icon} size={13} />}
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  eyebrowIcon,
  title,
  description,
  align = "left",
  tone = "light",
  className = "",
  id,
}: {
  eyebrow?: string;
  eyebrowIcon?: GlyphName;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  id?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-4 ${align === "center" ? "items-center text-center" : "items-start"} ${className}`}
    >
      {eyebrow && (
        <Eyebrow icon={eyebrowIcon} tone={tone === "dark" ? "light" : "brand"}>
          {eyebrow}
        </Eyebrow>
      )}
      <h2
        id={id}
        className={`max-w-3xl font-display text-[clamp(1.85rem,3.4vw,2.85rem)] font-semibold leading-[1.1] ${
          tone === "dark" ? "text-white" : "text-ink-950"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`max-w-2xl text-[1.02rem] leading-relaxed ${
            tone === "dark" ? "text-ink-200" : "text-ink-500"
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "sky" | "amber" | "violet" | "rose" | "dark";
  className?: string;
}) {
  const tones = {
    neutral: "bg-ink-50 text-ink-600 border-ink-100",
    brand: "bg-brand-50 text-brand-800 border-brand-100",
    sky: "bg-[#eef4fe] text-[#1d4f9e] border-[#d8e6fd]",
    amber: "bg-[#fdf4e6] text-[#94620f] border-[#f8e5c4]",
    violet: "bg-[#f2eefe] text-[#4b32a8] border-[#e3dafc]",
    rose: "bg-[#fdeef0] text-[#a32a38] border-[#f9d8dd]",
    dark: "bg-ink-950 text-white border-ink-950",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[0.7rem] font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((index) => (
        <Icon
          key={index}
          name="star"
          size={size}
          filled
          className={index <= Math.round(rating) ? "text-amber-accent" : "text-ink-200"}
        />
      ))}
    </span>
  );
}

export function Section({
  children,
  className = "",
  id,
  tone = "light",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "light" | "canvas" | "dark";
}) {
  const tones = {
    light: "bg-white",
    canvas: "bg-canvas",
    dark: "bg-ink-950 text-white",
  } as const;
  return (
    <section id={id} className={`relative ${tones[tone]} ${className}`}>
      {children}
    </section>
  );
}
