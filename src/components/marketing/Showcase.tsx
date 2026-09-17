import Link from "next/link";
import { AreaTrend } from "@/components/charts/Charts";
import { Icon, type GlyphName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/motion";
import { Badge, Card } from "@/components/ui/primitives";
import { formatDate, parseSeries } from "@/lib/format";

export type CaseStudyCardData = {
  id: number;
  slug: string;
  company: string;
  industry: string;
  market: string;
  headline: string;
  startingPoint: string;
  strategy: string;
  trafficChange: number;
  keywordChange: number;
  referringDomainGrowth: number;
  durationMonths: number;
  series: string;
};

export function CaseStudyGrid({ items }: { items: CaseStudyCardData[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {items.map((item, index) => (
        <Reveal key={item.id} delay={index * 80}>
          <Card as="article" hover className="flex h-full flex-col overflow-hidden">
            <div className="relative h-28 overflow-hidden border-b border-line bg-gradient-to-br from-brand-50 via-white to-[#eef4fe]">
              <div className="absolute inset-0 opacity-90">
                <AreaTrend values={parseSeries(item.series)} uid={`case-${item.id}`} height={120} width={420} showGrid={false} />
              </div>
              <span className="absolute left-4 top-3"><Badge tone="dark">{item.industry}</Badge></span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="text-[0.74rem] font-medium uppercase tracking-[0.08em] text-ink-400">{item.company}</p>
              <h3 className="mt-1.5 font-display text-[1.06rem] font-semibold leading-snug text-ink-950">{item.headline}</h3>
              <p className="mt-2.5 flex-1 text-[0.86rem] leading-relaxed text-ink-500">{item.startingPoint}</p>
              <dl className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-canvas p-3 text-center">
                <div><dt className="text-[0.62rem] uppercase tracking-wide text-ink-400">Traffic</dt><dd className="font-display text-[1rem] font-semibold text-brand-700">+{item.trafficChange}%</dd></div>
                <div><dt className="text-[0.62rem] uppercase tracking-wide text-ink-400">Keywords</dt><dd className="font-display text-[1rem] font-semibold text-brand-700">+{item.keywordChange}%</dd></div>
                <div><dt className="text-[0.62rem] uppercase tracking-wide text-ink-400">Ref. domains</dt><dd className="font-display text-[1rem] font-semibold text-brand-700">+{item.referringDomainGrowth}</dd></div>
              </dl>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                <span className="inline-flex items-center gap-1.5 text-[0.76rem] text-ink-400"><Icon name="clock" size={14} />{item.durationMonths} months · {item.market}</span>
                <Link href={`/case-studies/${item.slug}`} className="inline-flex items-center gap-1.5 text-[0.84rem] font-semibold text-ink-900 transition-colors hover:text-brand-700">View Case Study <Icon name="arrow-right" size={14} /></Link>
              </div>
            </div>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}

export type ArticleCardData = {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readingMinutes: number;
  publishedOn: string;
  author: string;
};

const CATEGORY_TONES: Record<string, "brand" | "sky" | "amber" | "violet" | "neutral"> = {
  "Link Building": "brand",
  "Guest Posting": "sky",
  "Digital PR": "amber",
  Outreach: "violet",
  "Anchor Text": "brand",
  "Link Audits": "sky",
  "Case Studies": "amber",
  "Industry News": "neutral",
  "Local SEO": "brand",
  "Technical SEO": "sky",
};

const COVER_STYLES = [
  "from-[#081f25] via-[#0b5f54] to-[#22a77e]",
  "from-[#0b1b34] via-[#17487c] to-[#55a2da]",
  "from-[#2b1c11] via-[#8e5721] to-[#efae4e]",
  "from-[#21163a] via-[#6043a5] to-[#9f8aec]",
  "from-[#231724] via-[#744360] to-[#d47a9d]",
  "from-[#14262c] via-[#355d66] to-[#7faeb2]",
] as const;

function coverIndex(slug: string) {
  let hash = 0;
  for (const char of slug) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return hash % COVER_STYLES.length;
}

function categoryIcon(category: string): GlyphName {
  if (category.includes("Guest")) return "quill";
  if (category.includes("PR")) return "megaphone";
  if (category.includes("Outreach")) return "mail";
  if (category.includes("Local")) return "pin";
  if (category.includes("Audit")) return "gauge";
  if (category.includes("Anchor")) return "link";
  return "link";
}

function coverLabel(title: string) {
  const stop = new Set(["a", "an", "the", "and", "or", "for", "to", "of", "in", "on", "with", "how", "what", "why", "your", "you", "is", "are"]);
  return title
    .replace(/[?:(),]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stop.has(word.toLowerCase()))
    .slice(0, 3)
    .join(" ");
}

export function ArticleCover({ item, compact = false }: { item: ArticleCardData; compact?: boolean }) {
  const style = COVER_STYLES[coverIndex(item.slug)];
  const label = coverLabel(item.title);
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${style} text-white ${compact ? "h-40" : "min-h-[17rem]"}`}>
      <div className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)", backgroundSize: "34px 34px" }} />
      <span className="absolute -right-12 -top-14 h-44 w-44 rounded-full border-[28px] border-white/10" />
      <span className="absolute -bottom-20 -left-14 h-52 w-52 rounded-full border-[32px] border-white/10" />
      <div className="absolute right-[11%] top-[22%] hidden rotate-3 rounded-xl border border-white/20 bg-white/10 p-3 shadow-xl backdrop-blur-sm sm:block">
        <div className="flex items-center gap-2"><Icon name="search" size={14} /><span className="text-[0.61rem] font-semibold uppercase tracking-[0.12em]">Research</span></div>
        <div className="mt-2 h-1.5 w-20 rounded-full bg-white/25"><div className="h-full w-3/4 rounded-full bg-white/80" /></div>
      </div>
      <div className="absolute bottom-[18%] right-[18%] hidden -rotate-2 rounded-xl border border-white/20 bg-white/10 px-3 py-2 shadow-xl backdrop-blur-sm sm:block">
        <span className="inline-flex items-center gap-1.5 text-[0.61rem] font-semibold uppercase tracking-[0.11em]"><Icon name="link" size={13} />Relevance</span>
      </div>
      <div className={`relative flex h-full flex-col justify-between ${compact ? "p-5" : "p-7 sm:p-8"}`}>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm"><Icon name={categoryIcon(item.category)} size={20} /></span>
        <div className={compact ? "mt-12" : "mt-24 max-w-[70%]"}>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-white/65">{item.category}</p>
          <p className={`${compact ? "mt-1 text-[1.05rem]" : "mt-2 text-[1.45rem] sm:text-[1.7rem]"} font-display font-semibold leading-[1.05] tracking-[-0.02em] text-white`}>{label || item.category}</p>
        </div>
      </div>
    </div>
  );
}

export function ArticleGrid({ items, columns = 3 }: { items: ArticleCardData[]; columns?: 3 | 4 }) {
  return (
    <div className={`grid gap-5 sm:grid-cols-2 ${columns === 4 ? "xl:grid-cols-4" : "lg:grid-cols-3"}`}>
      {items.map((item, index) => (
        <Reveal key={item.id} delay={(index % 4) * 70}>
          <Card as="article" hover className="flex h-full flex-col overflow-hidden p-0">
            <Link href={`/resources/${item.slug}`} aria-label={`Read ${item.title}`}><ArticleCover item={item} compact /></Link>
            <div className="flex flex-1 flex-col p-5">
              <Badge tone={CATEGORY_TONES[item.category] ?? "neutral"}>{item.category}</Badge>
              <h3 className="mt-3 font-display text-[1rem] font-semibold leading-snug text-ink-950">
                <Link href={`/resources/${item.slug}`} className="transition-colors hover:text-brand-700">{item.title}</Link>
              </h3>
              <p className="mt-2 line-clamp-3 flex-1 text-[0.82rem] leading-relaxed text-ink-500">{item.excerpt}</p>
              <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-[0.71rem] text-ink-400">
                <span>{formatDate(item.publishedOn)}</span>
                <span className="inline-flex items-center gap-1.5"><Icon name="clock" size={13} />{item.readingMinutes} min read</span>
              </div>
            </div>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}
