import type { GlyphName } from "@/components/ui/Icon";

export type Faq = { question: string; answer: string };

export type Review = {
  name: string;
  role: string;
  country: string;
  rating: number;
  date: string;
  tier: string;
  text: string;
};

export type Tier = "starter" | "growth" | "scale";

export type Package = {
  tier: Tier;
  name: string;
  price: number;
  deliveryDays: number;
  revisions: number;
  volume: string;
  summary: string;
  features: string[];
  recommended?: boolean;
};

export type Step = { title: string; body: string };
export type Benefit = { title: string; body: string };

/** A consolidated backlink service landing page. */
export type BacklinkService = {
  slug: string;
  group: string;
  nav: string;
  icon: GlyphName;
  accent: "brand" | "sky" | "amber" | "violet";
  h1: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  keywords: string[];
  /** Closely related sub-services consolidated into this page. */
  variants: string[];
  intro: string[];
  included: string[];
  benefits: Benefit[];
  process: Step[];
  placement: string;
  quality: string;
  useCases: string[];
  stats: { label: string; value: string }[];
  packages: Package[];
  faqs: Faq[];
  reviews: Review[];
  related: string[];
  cta: { heading: string; body: string };
};

export type IndustryPage = {
  slug: string;
  name: string;
  icon: GlyphName;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  summary: string;
  keywords: string[];
  intro: string[];
  publisherTypes: string[];
  opportunities: Benefit[];
  anchorGuidance: string;
  qualityNote: string;
  recommendedServices: string[];
  faqs: Faq[];
  reviews: Review[];
};

export type CountryPage = {
  slug: string;
  country: string;
  flagCode: string;
  language: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  summary: string;
  keywords: string[];
  intro: string[];
  publisherLandscape: string[];
  localSignals: Benefit[];
  anchorGuidance: string;
  recommendedServices: string[];
  faqs: Faq[];
  reviews: Review[];
};
