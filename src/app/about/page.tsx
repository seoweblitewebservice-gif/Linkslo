import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Counter, Reveal } from "@/components/ui/motion";
import { Button, Card, SectionHeading } from "@/components/ui/primitives";
import { BRAND, TRUST_STATS } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About",
  description:
    "Linkslo is an Amsterdam-based backlink and link building company working exclusively on off-page authority for in-house teams and agencies.",
};

const PRINCIPLES = [
  {
    icon: "shield" as const,
    title: "Say no more often",
    body: "Roughly a third of the domains submitted to us are rejected. Declining revenue is the only way a marketplace stays worth using.",
  },
  {
    icon: "chart" as const,
    title: "Show the working",
    body: "Every metric we display can be traced back to a method. If a number is an estimate, we label it as one.",
  },
  {
    icon: "users" as const,
    title: "Practitioners, not packagers",
    body: "Everyone on the strategy team has run campaigns in-house or agency-side. We build for the person who has to present results.",
  },
  {
    icon: "clock" as const,
    title: "Long horizons",
    body: "We plan in quarters and report monthly. Anyone promising durable authority in six weeks is selling something else.",
  },
];

const TIMELINE = [
  { year: "2018", title: "Founded in Amsterdam", body: "Three practitioners left agency roles to build a publisher network with real screening standards." },
  { year: "2020", title: "Marketplace launched", body: "Self-service inventory opened with 4,000 vetted domains across six European markets." },
  { year: "2022", title: "Workspace and reporting", body: "Campaign management, multi-client workspaces and scheduled exports shipped for agency customers." },
  { year: "2024", title: "Digital PR division", body: "A dedicated newsroom team added data-led campaign capability alongside placement services." },
  { year: "2026", title: "Link Gap Scout", body: "Backlink gap modelling brought competitor analysis and publisher inventory into one workflow." },
];

const PARTNERS = [
  "Independent publisher network",
  "Backlink data and rank-tracking integrations",
  "Agency white-label programme",
  "Freelance writer collective (15 languages)",
];

const ROLES = [
  { title: "Senior Link Building Strategist", location: "Amsterdam or remote (CET ±2)", type: "Full-time" },
  { title: "Publisher Partnerships Manager", location: "Remote, Europe", type: "Full-time" },
  { title: "Digital PR Campaign Lead", location: "London or remote", type: "Full-time" },
  { title: "Product Engineer (Next.js)", location: "Amsterdam", type: "Full-time" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        eyebrowIcon="compass"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        title="We only build backlinks"
        description={`${BRAND.name} started in ${BRAND.foundedYear} because buying links was easy and buying good ones was not. We built the screening, the workspace and the reporting we wanted as practitioners — then opened it up.`}
      />

      <section className="border-b border-line bg-canvas py-12">
        <div className="container-x">
          <dl className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {TRUST_STATS.map((stat) => (
              <div key={stat.label}>
                <dd className="font-display text-[1.7rem] font-semibold text-ink-950">
                  <Counter value={stat.value} decimals={stat.value % 1 !== 0 ? 1 : 0} suffix={stat.suffix} />
                </dd>
                <dt className="mt-1 text-[0.82rem] text-ink-500">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHeading
              eyebrow="Principles"
              eyebrowIcon="shield"
              title="Four rules we do not bend"
              description="They cost us revenue occasionally. They are also the reason customers stay."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {PRINCIPLES.map((item, index) => (
              <Reveal key={item.title} delay={(index % 2) * 70}>
                <Card hover className="h-full p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon name={item.icon} size={19} />
                  </span>
                  <h3 className="mt-4 font-display text-[1.05rem] font-semibold text-ink-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-500">{item.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-canvas py-16 sm:py-20">
        <div className="container-x">
          <Reveal>
            <SectionHeading eyebrow="Timeline" eyebrowIcon="clock" title="How we got here" />
          </Reveal>
          <ol className="mt-10 space-y-6 border-l border-line pl-6">
            {TIMELINE.map((item, index) => (
              <Reveal key={item.year} delay={index * 60} as="li">
                <div className="relative">
                  <span className="absolute -left-[1.9rem] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-brand-500 shadow-soft" />
                  <p className="font-mono text-[0.78rem] font-semibold tracking-[0.14em] text-brand-700">
                    {item.year}
                  </p>
                  <p className="mt-1 font-display text-[1.05rem] font-semibold text-ink-950">
                    {item.title}
                  </p>
                  <p className="mt-1 max-w-2xl text-[0.9rem] leading-relaxed text-ink-500">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section id="partners" className="bg-white py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <SectionHeading
              eyebrow="Partners"
              eyebrowIcon="users"
              title="Who we work with"
              description="We partner with publishers, agencies and tooling providers rather than reselling anonymous networks."
            />
            <ul className="mt-7 space-y-3">
              {PARTNERS.map((partner) => (
                <li key={partner} className="flex gap-2.5 text-[0.92rem] text-ink-600">
                  <Icon name="check" size={17} className="mt-0.5 shrink-0 text-brand-600" />
                  {partner}
                </li>
              ))}
            </ul>
            <Button href="/contact" className="mt-7" icon="arrow-right">
              Become a partner
            </Button>
          </Reveal>

          <Reveal delay={100}>
            <div id="careers">
              <SectionHeading
                eyebrow="Careers"
                eyebrowIcon="spark"
                title="Open roles"
                description="Small team, senior bar, no growth-hacking theatre."
              />
              <ul className="mt-7 space-y-3">
                {ROLES.map((role) => (
                  <li
                    key={role.title}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-canvas px-4 py-3.5 transition-colors hover:border-brand-200 hover:bg-white"
                  >
                    <div>
                      <p className="text-[0.92rem] font-semibold text-ink-950">{role.title}</p>
                      <p className="text-[0.78rem] text-ink-400">{role.location}</p>
                    </div>
                    <span className="rounded-full border border-line bg-white px-2.5 py-1 text-[0.72rem] font-medium text-ink-600">
                      {role.type}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-[0.85rem] text-ink-500">
                Nothing matching? Write to us anyway — we keep good applications on file.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
