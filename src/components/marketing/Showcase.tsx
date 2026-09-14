import Link from "next/link";
import { AreaTrend } from "@/components/charts/Charts";
import { Icon } from "@/components/ui/Icon";
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
                <AreaTrend
                  values={parseSeries(item.series)}
                  uid={`case-${item.id}`}
                  height={120}
                  width={420}
                  showGrid={false}
                />
              </div>
              <span className="absolute left-4 top-3">
                <Badge tone="dark">{item.industry}</Badge>
              </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <p className="text-[0.74rem] font-medium uppercase tracking-[0.08em] text-ink-400">
                {item.company}
              </p>
              <h3 className="mt-1.5 font-display text-[1.06rem] font-semibold leading-snug text-ink-950">
                {item.headline}
              </h3>
              <p className="mt-2.5 flex-1 text-[0.86rem] leading-relaxed text-ink-500">
                {item.startingPoint}
              </p>

              <dl className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-canvas p-3 text-center">
                <div>
                  <dt className="text-[0.62rem] uppercase tracking-wide text-ink-400">Traffic</dt>
                  <dd className="font-display text-[1rem] font-semibold text-brand-700">
                    +{item.trafficChange}%
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.62rem] uppercase tracking-wide text-ink-400">Keywords</dt>
                  <dd className="font-display text-[1rem] font-semibold text-brand-700">
                    +{item.keywordChange}%
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.62rem] uppercase tracking-wide text-ink-400">Ref. domains</dt>
                  <dd className="font-display text-[1rem] font-semibold text-brand-700">
                    +{item.referringDomainGrowth}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
                <span className="inline-flex items-center gap-1.5 text-[0.76rem] text-ink-400">
                  <Icon name="clock" size={14} />
                  {item.durationMonths} months · {item.market}
                </span>
                <Link
                  href={`/case-studies/${item.slug}`}
                  className="inline-flex items-center gap-1.5 text-[0.84rem] font-semibold text-ink-900 transition-colors hover:text-brand-700"
                >
                  View Case Study
                  <Icon name="arrow-right" size={14} />
                </Link>
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
};

export function ArticleGrid({ items, columns = 4 }: { items: ArticleCardData[]; columns?: 3 | 4 }) {
  return (
    <div className={`grid gap-5 sm:grid-cols-2 ${columns === 4 ? "xl:grid-cols-4" : "lg:grid-cols-3"}`}>
      {items.map((item, index) => (
        <Reveal key={item.id} delay={(index % 4) * 70}>
          <Card as="article" hover className="flex h-full flex-col p-5">
            <Badge tone={CATEGORY_TONES[item.category] ?? "neutral"}>{item.category}</Badge>
            <h3 className="mt-3 font-display text-[1.02rem] font-semibold leading-snug text-ink-950">
              <Link href={`/resources/${item.slug}`} className="transition-colors hover:text-brand-700">
                {item.title}
              </Link>
            </h3>
            <p className="mt-2 flex-1 text-[0.86rem] leading-relaxed text-ink-500">{item.excerpt}</p>
            <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-[0.74rem] text-ink-400">
              <span>{formatDate(item.publishedOn)}</span>
              <span className="inline-flex items-center gap-1.5">
                <Icon name="clock" size={13} />
                {item.readingMinutes} min read
              </span>
            </div>
            <Link
              href={`/resources/${item.slug}`}
              className="mt-3 inline-flex items-center gap-1.5 text-[0.84rem] font-semibold text-ink-900 transition-colors hover:text-brand-700"
            >
              Read Article
              <Icon name="arrow-right" size={14} />
            </Link>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}
