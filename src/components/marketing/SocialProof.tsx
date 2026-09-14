"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Stars } from "@/components/ui/primitives";

export type TestimonialItem = {
  id: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  initials: string;
  accent: string;
};

const ACCENT_BG: Record<string, string> = {
  brand: "#098366",
  sky: "#3f86f5",
  amber: "#f0a441",
  violet: "#8367f0",
};

export function TestimonialCarousel({ items }: { items: TestimonialItem[] }) {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(1);

  useEffect(() => {
    const compute = () => {
      const width = window.innerWidth;
      setPerView(width >= 1024 ? 3 : width >= 640 ? 2 : 1);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const maxIndex = Math.max(items.length - perView, 0);
  const safeIndex = Math.min(index, maxIndex);

  const go = (direction: number) => {
    setIndex((current) => {
      const next = current + direction;
      if (next < 0) return maxIndex;
      if (next > maxIndex) return 0;
      return next;
    });
  };

  if (!items.length) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <ul
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(-${safeIndex * (100 / perView)}%)` }}
        >
          {items.map((item) => (
            <li
              key={item.id}
              className="shrink-0 px-2.5"
              style={{ width: `${100 / perView}%` }}
            >
              <figure className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-soft transition-shadow duration-300 hover:shadow-lift">
                <Icon name="quote" size={26} className="text-brand-200" filled />
                <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-ink-700">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full text-[0.78rem] font-semibold text-white"
                    style={{ background: ACCENT_BG[item.accent] ?? ACCENT_BG.brand }}
                    aria-hidden="true"
                  >
                    {item.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.88rem] font-semibold text-ink-950">
                      {item.name}
                    </span>
                    <span className="block truncate text-[0.76rem] text-ink-400">
                      {item.role}, {item.company}
                    </span>
                  </span>
                  <span className="ml-auto">
                    <Stars rating={item.rating} size={13} />
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-7 flex items-center justify-between gap-4 px-2.5">
        <div className="flex gap-1.5" role="tablist" aria-label="Testimonial pages">
          {Array.from({ length: maxIndex + 1 }).map((_, dot) => (
            <button
              key={dot}
              type="button"
              role="tab"
              aria-selected={dot === safeIndex}
              aria-label={`Go to testimonial group ${dot + 1}`}
              onClick={() => setIndex(dot)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                dot === safeIndex ? "w-7 bg-brand-600" : "w-3 bg-ink-200 hover:bg-ink-300"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous testimonials"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-700"
          >
            <Icon name="arrow-right" size={17} className="rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next testimonials"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-700"
          >
            <Icon name="arrow-right" size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

export type FaqItem = { id: number; question: string; answer: string; topic: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(items[0]?.id ?? null);

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
      {items.map((item) => {
        const expanded = open === item.id;
        return (
          <li key={item.id}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : item.id)}
                aria-expanded={expanded}
                aria-controls={`faq-panel-${item.id}`}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-canvas/70 sm:px-6 sm:py-5"
              >
                <span className="flex-1 text-[0.98rem] font-semibold text-ink-950">
                  {item.question}
                </span>
                <span className="hidden shrink-0 rounded-full border border-line px-2 py-0.5 text-[0.66rem] font-medium uppercase tracking-wide text-ink-400 sm:inline">
                  {item.topic}
                </span>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    expanded
                      ? "rotate-180 border-brand-300 bg-brand-50 text-brand-700"
                      : "border-line text-ink-400"
                  }`}
                >
                  <Icon name="chevron-down" size={16} />
                </span>
              </button>
            </h3>
            <div
              id={`faq-panel-${item.id}`}
              className={`grid transition-all duration-350 ease-out ${
                expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 pr-14 text-[0.92rem] leading-relaxed text-ink-500 sm:px-6 sm:pb-6">
                  {item.answer}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
