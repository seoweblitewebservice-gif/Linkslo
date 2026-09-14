"use client";

import { useMemo, useState } from "react";
import { AreaTrend, BarSeries, DonutGauge, MiniColumns, ProgressBar } from "@/components/charts/Charts";
import { Icon, type GlyphName } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/primitives";
import { formatCompact, formatCurrency, formatDate, formatNumber } from "@/lib/format";

export type DashProject = {
  id: number;
  name: string;
  domain: string;
  industry: string;
  market: string;
  authorityScore: number;
  organicTraffic: number;
  referringDomains: number;
  trackedKeywords: number;
  trafficSeries: number[];
  keywordSeries: number[];
};

export type DashCampaign = {
  id: number;
  projectId: number;
  name: string;
  objective: string;
  status: string;
  progress: number;
  placementsLive: number;
  placementsTotal: number;
  budget: number;
  startedOn: string;
};

export type DashPlacement = {
  id: number;
  campaignId: number;
  domain: string;
  anchor: string;
  targetPath: string;
  authority: number;
  status: string;
  publishedOn: string;
};

export type DashListing = {
  id: number;
  domain: string;
  industry: string;
  authority: number;
  organicTraffic: number;
  price: number;
  country: string;
};

const TABS: { id: string; label: string; icon: GlyphName }[] = [
  { id: "overview", label: "Overview", icon: "chart" },
  { id: "projects", label: "Projects", icon: "layers" },
  { id: "marketplace", label: "Marketplace", icon: "search" },
  { id: "campaigns", label: "Campaigns", icon: "target" },
  { id: "reports", label: "Reports", icon: "document" },
  { id: "content", label: "Link content", icon: "quill" },
  { id: "billing", label: "Billing", icon: "wallet" },
];

const STATUS_TONES: Record<string, "brand" | "sky" | "amber" | "violet" | "neutral"> = {
  Live: "brand",
  Indexing: "sky",
  Scheduled: "violet",
  Drafting: "amber",
  "In review": "amber",
};

function StatCard({
  label,
  value,
  delta,
  tone = "brand",
  series,
  icon,
}: {
  label: string;
  value: string;
  delta?: string;
  tone?: "brand" | "sky" | "amber" | "violet";
  series?: number[];
  icon: GlyphName;
}) {
  return (
    <div className="rounded-xl border border-line bg-white p-4 transition-shadow duration-300 hover:shadow-soft">
      <div className="flex items-start justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-canvas text-ink-500">
          <Icon name={icon} size={16} />
        </span>
        {delta && (
          <span className="rounded-md bg-brand-50 px-1.5 py-0.5 text-[0.68rem] font-semibold text-brand-700">
            {delta}
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-[1.35rem] font-semibold leading-none text-ink-950">
        {value}
      </p>
      <p className="mt-1.5 text-[0.76rem] text-ink-400">{label}</p>
      {series && (
        <div className="mt-2.5">
          <MiniColumns values={series} tone={tone} />
        </div>
      )}
    </div>
  );
}

function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title: string;
  action?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-xl border border-line bg-white ${className}`}>
      <header className="flex items-center justify-between border-b border-line px-4 py-3">
        <h3 className="text-[0.86rem] font-semibold text-ink-950">{title}</h3>
        {action && <span className="text-[0.74rem] font-medium text-ink-400">{action}</span>}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

export function DashboardApp({
  projects,
  campaigns,
  placements,
  listings,
  variant = "full",
}: {
  projects: DashProject[];
  campaigns: DashCampaign[];
  placements: DashPlacement[];
  listings: DashListing[];
  variant?: "full" | "embedded";
}) {
  const [tab, setTab] = useState("overview");
  const [projectId, setProjectId] = useState(projects[0]?.id ?? 0);

  const project = useMemo(
    () => projects.find((item) => item.id === projectId) ?? projects[0],
    [projects, projectId],
  );

  const projectCampaigns = useMemo(
    () => campaigns.filter((item) => item.projectId === project?.id),
    [campaigns, project],
  );

  const campaignIds = useMemo(() => new Set(projectCampaigns.map((item) => item.id)), [projectCampaigns]);

  const projectPlacements = useMemo(
    () => placements.filter((item) => campaignIds.has(item.campaignId)),
    [placements, campaignIds],
  );

  if (!project) {
    return (
      <div className="rounded-2xl border border-line bg-white p-10 text-center text-ink-500">
        No workspace data available yet.
      </div>
    );
  }

  const liveCount = projectCampaigns.reduce((total, item) => total + item.placementsLive, 0);
  const totalCount = projectCampaigns.reduce((total, item) => total + item.placementsTotal, 0);
  const avgProgress = projectCampaigns.length
    ? Math.round(projectCampaigns.reduce((total, item) => total + item.progress, 0) / projectCampaigns.length)
    : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-canvas shadow-[0_30px_70px_-45px_rgba(6,20,25,0.4)]">
      <div className="flex min-h-[36rem] flex-col md:flex-row">
        {/* Sidebar */}
        <nav
          aria-label="Workspace"
          className="shrink-0 border-b border-line bg-white md:w-[13.5rem] md:border-b-0 md:border-r"
        >
          <div className="hidden items-center gap-2 border-b border-line px-4 py-4 md:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-950 text-[0.7rem] font-bold text-white">
              AS
            </span>
            <div className="min-w-0">
              <p className="truncate text-[0.82rem] font-semibold text-ink-950">Linkslo</p>
              <p className="truncate text-[0.68rem] text-ink-400">Workspace</p>
            </div>
          </div>
          <ul className="no-scrollbar flex gap-1 overflow-x-auto p-2 md:flex-col md:gap-0.5 md:overflow-visible md:p-3">
            {TABS.map((item) => {
              const active = tab === item.id;
              return (
                <li key={item.id} className="shrink-0 md:w-full">
                  <button
                    type="button"
                    onClick={() => setTab(item.id)}
                    aria-current={active ? "page" : undefined}
                    className={`flex w-full items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-[0.84rem] font-medium transition-colors ${
                      active
                        ? "bg-brand-50 text-brand-800"
                        : "text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                    }`}
                  >
                    <Icon name={item.icon} size={16} />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="hidden border-t border-line p-3 md:block">
            <div className="rounded-lg bg-ink-950 p-3 text-white">
              <p className="text-[0.76rem] font-semibold">Growth plan</p>
              <p className="mt-1 text-[0.68rem] text-ink-300">7 of 10 projects used</p>
              <ProgressBar value={70} className="mt-2 bg-white/15" />
            </div>
          </div>
        </nav>

        {/* Main */}
        <div className="min-w-0 flex-1">
          <header className="flex flex-wrap items-center gap-3 border-b border-line bg-white px-4 py-3">
            <div className="relative">
              <select
                value={projectId}
                onChange={(event) => setProjectId(Number(event.target.value))}
                aria-label="Select project"
                className="h-9 appearance-none rounded-lg border border-line bg-white pl-3 pr-8 text-[0.82rem] font-semibold text-ink-900 hover:border-ink-200 focus:border-brand-400"
              >
                {projects.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <Icon
                name="chevron-down"
                size={14}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400"
              />
            </div>
            <span className="hidden text-[0.76rem] text-ink-400 sm:block">
              {project.domain} · {project.market}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-lg bg-brand-50 px-2.5 py-1.5 text-[0.72rem] font-semibold text-brand-700 sm:inline-flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />
                Data synced
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3f86f5] text-[0.68rem] font-semibold text-white">
                RA
              </span>
            </div>
          </header>

          <div className="space-y-4 p-4">
            {tab === "overview" && (
              <>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <StatCard
                    icon="chart"
                    label="Organic traffic (monthly)"
                    value={formatCompact(project.organicTraffic)}
                    delta="+21%"
                    series={project.trafficSeries.slice(-8)}
                  />
                  <StatCard
                    icon="link"
                    label="Referring domains"
                    value={formatNumber(project.referringDomains)}
                    delta="+96"
                    tone="sky"
                    series={[1620, 1710, 1798, 1850, 1922, 1990, 2064, project.referringDomains]}
                  />
                  <StatCard
                    icon="search"
                    label="Keyword visibility"
                    value={`${formatNumber(project.trackedKeywords)} tracked`}
                    delta="+214 top 10"
                    tone="violet"
                    series={project.keywordSeries.slice(-8)}
                  />
                  <StatCard
                    icon="target"
                    label="Campaign progress"
                    value={`${avgProgress}%`}
                    delta={`${projectCampaigns.length} active`}
                    tone="amber"
                  />
                  <StatCard
                    icon="check"
                    label="Published links"
                    value={`${liveCount} / ${totalCount}`}
                    delta="+7 this month"
                  />
                  <StatCard
                    icon="clock"
                    label="Pending orders"
                    value={String(Math.max(totalCount - liveCount, 0))}
                    delta="Avg. 11 days"
                    tone="sky"
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
                  <Panel title="Organic sessions" action="Last 12 months">
                    <div className="h-48">
                      <AreaTrend values={project.trafficSeries} uid={`dash-${project.id}`} height={180} width={640} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-4 border-t border-line pt-3 text-[0.74rem] text-ink-500">
                      <span>
                        Peak{" "}
                        <strong className="text-ink-900">
                          {formatCompact(Math.max(...project.trafficSeries) * 1000)}
                        </strong>
                      </span>
                      <span>
                        Authority score <strong className="text-ink-900">{project.authorityScore}</strong>
                      </span>
                      <span>
                        Industry <strong className="text-ink-900">{project.industry}</strong>
                      </span>
                    </div>
                  </Panel>

                  <Panel title="Keyword movement" action="Top 10 positions">
                    <div className="flex items-center justify-between gap-4">
                      <DonutGauge value={project.authorityScore} label={String(project.authorityScore)} caption="Authority" />
                      <div className="flex-1">
                        <BarSeries values={project.keywordSeries.slice(-6)} height={92} tone="violet" />
                        <p className="mt-2 text-[0.72rem] text-ink-400">
                          Six-month trend for tracked non-brand terms.
                        </p>
                      </div>
                    </div>
                  </Panel>
                </div>

                <Panel title="Recent placements" action={`${projectPlacements.length} records`}>
                  <div className="-mx-4 overflow-x-auto px-4">
                    <table className="w-full min-w-[38rem] text-left text-[0.82rem]">
                      <thead>
                        <tr className="text-[0.68rem] uppercase tracking-wide text-ink-400">
                          <th scope="col" className="pb-2 font-semibold">Domain</th>
                          <th scope="col" className="pb-2 font-semibold">Anchor</th>
                          <th scope="col" className="pb-2 font-semibold">Target</th>
                          <th scope="col" className="pb-2 font-semibold">DR</th>
                          <th scope="col" className="pb-2 font-semibold">Status</th>
                          <th scope="col" className="pb-2 text-right font-semibold">Published</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {projectPlacements.map((item) => (
                          <tr key={item.id} className="transition-colors hover:bg-canvas">
                            <td className="py-2.5 font-medium text-ink-900">{item.domain}</td>
                            <td className="py-2.5 text-ink-500">{item.anchor}</td>
                            <td className="py-2.5 font-mono text-[0.76rem] text-ink-500">{item.targetPath}</td>
                            <td className="py-2.5 font-mono text-ink-800">{item.authority}</td>
                            <td className="py-2.5">
                              <Badge tone={STATUS_TONES[item.status] ?? "neutral"}>{item.status}</Badge>
                            </td>
                            <td className="py-2.5 text-right text-ink-500">{formatDate(item.publishedOn)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Panel>
              </>
            )}

            {tab === "projects" && (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {projects.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setProjectId(item.id)}
                    className={`rounded-xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft ${
                      item.id === projectId ? "border-brand-300 bg-brand-50/40" : "border-line bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[0.9rem] font-semibold text-ink-950">{item.name}</p>
                      {item.id === projectId && <Badge tone="brand">Active</Badge>}
                    </div>
                    <p className="text-[0.74rem] text-ink-400">{item.domain}</p>
                    <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-lg bg-canvas py-2">
                        <dt className="text-[0.62rem] uppercase text-ink-400">DR</dt>
                        <dd className="text-[0.86rem] font-semibold text-ink-900">{item.authorityScore}</dd>
                      </div>
                      <div className="rounded-lg bg-canvas py-2">
                        <dt className="text-[0.62rem] uppercase text-ink-400">Traffic</dt>
                        <dd className="text-[0.86rem] font-semibold text-ink-900">
                          {formatCompact(item.organicTraffic)}
                        </dd>
                      </div>
                      <div className="rounded-lg bg-canvas py-2">
                        <dt className="text-[0.62rem] uppercase text-ink-400">RDs</dt>
                        <dd className="text-[0.86rem] font-semibold text-ink-900">
                          {formatCompact(item.referringDomains)}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-3">
                      <MiniColumns values={item.trafficSeries.slice(-10)} />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {tab === "marketplace" && (
              <Panel title="Saved opportunities" action="Synced with marketplace filters">
                <div className="-mx-4 overflow-x-auto px-4">
                  <table className="w-full min-w-[36rem] text-left text-[0.82rem]">
                    <thead>
                      <tr className="text-[0.68rem] uppercase tracking-wide text-ink-400">
                        <th scope="col" className="pb-2 font-semibold">Website</th>
                        <th scope="col" className="pb-2 font-semibold">Industry</th>
                        <th scope="col" className="pb-2 font-semibold">DR</th>
                        <th scope="col" className="pb-2 font-semibold">Traffic</th>
                        <th scope="col" className="pb-2 font-semibold">Country</th>
                        <th scope="col" className="pb-2 text-right font-semibold">Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {listings.map((item) => (
                        <tr key={item.id} className="transition-colors hover:bg-canvas">
                          <td className="py-2.5 font-medium text-ink-900">{item.domain}</td>
                          <td className="py-2.5 text-ink-500">{item.industry}</td>
                          <td className="py-2.5 font-mono text-ink-800">{item.authority}</td>
                          <td className="py-2.5 text-ink-500">{formatCompact(item.organicTraffic)}</td>
                          <td className="py-2.5 text-ink-500">{item.country}</td>
                          <td className="py-2.5 text-right font-semibold text-ink-900">
                            {formatCurrency(item.price)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            )}

            {tab === "campaigns" && (
              <div className="space-y-3">
                {projectCampaigns.map((item) => (
                  <div key={item.id} className="rounded-xl border border-line bg-white p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-[0.92rem] font-semibold text-ink-950">{item.name}</p>
                        <p className="text-[0.74rem] text-ink-400">
                          {item.objective} · started {formatDate(item.startedOn)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge tone={STATUS_TONES[item.status] ?? "neutral"}>{item.status}</Badge>
                        <span className="text-[0.82rem] font-semibold text-ink-900">
                          {formatCurrency(item.budget)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <ProgressBar value={item.progress} className="flex-1" />
                      <span className="w-24 shrink-0 text-right text-[0.76rem] text-ink-500">
                        {item.placementsLive}/{item.placementsTotal} live
                      </span>
                    </div>
                  </div>
                ))}
                {!projectCampaigns.length && (
                  <p className="rounded-xl border border-dashed border-line bg-white p-8 text-center text-[0.86rem] text-ink-500">
                    No campaigns for this project yet.
                  </p>
                )}
              </div>
            )}

            {tab === "reports" && (
              <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
                <Panel title="Visibility report" action="Auto-generated monthly">
                  <div className="h-44">
                    <AreaTrend
                      values={project.keywordSeries}
                      tone="sky"
                      uid={`report-${project.id}`}
                      height={170}
                      width={620}
                    />
                  </div>
                </Panel>
                <Panel title="Scheduled exports">
                  <ul className="space-y-2.5">
                    {[
                      { name: "Executive summary", format: "PDF", cadence: "Monthly · 1st" },
                      { name: "Placement log", format: "CSV", cadence: "Weekly · Monday" },
                      { name: "Keyword movement", format: "XLSX", cadence: "Monthly · 1st" },
                      { name: "Budget utilisation", format: "PDF", cadence: "Quarterly" },
                    ].map((report) => (
                      <li
                        key={report.name}
                        className="flex items-center justify-between rounded-lg border border-line px-3 py-2.5 transition-colors hover:border-brand-200 hover:bg-brand-50/40"
                      >
                        <div>
                          <p className="text-[0.84rem] font-medium text-ink-900">{report.name}</p>
                          <p className="text-[0.7rem] text-ink-400">{report.cadence}</p>
                        </div>
                        <Badge tone="neutral">{report.format}</Badge>
                      </li>
                    ))}
                  </ul>
                </Panel>
              </div>
            )}

            {tab === "content" && (
              <div className="grid gap-3 md:grid-cols-4">
                {[
                  { stage: "Briefed", tone: "neutral" as const, items: ["Pricing page refresh", "Integrations hub"] },
                  { stage: "Drafting", tone: "amber" as const, items: ["Activation benchmarks", "Comparison: analytics tools"] },
                  { stage: "In review", tone: "sky" as const, items: ["Retention study"] },
                  { stage: "Published", tone: "brand" as const, items: ["Onboarding guide", "Data governance FAQ", "Customer journey primer"] },
                ].map((column) => (
                  <div key={column.stage} className="rounded-xl border border-line bg-white p-3">
                    <div className="mb-2.5 flex items-center justify-between">
                      <p className="text-[0.8rem] font-semibold text-ink-900">{column.stage}</p>
                      <Badge tone={column.tone}>{column.items.length}</Badge>
                    </div>
                    <ul className="space-y-2">
                      {column.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-lg border border-line bg-canvas px-2.5 py-2 text-[0.78rem] text-ink-700 transition-colors hover:border-brand-200 hover:bg-white"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {tab === "billing" && (
              <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
                <Panel title="Current plan">
                  <p className="font-display text-2xl font-semibold text-ink-950">Growth</p>
                  <p className="mt-1 text-[0.82rem] text-ink-500">€349 / month · renews 1 April 2026</p>
                  <dl className="mt-4 space-y-3">
                    <div>
                      <dt className="flex justify-between text-[0.78rem] text-ink-500">
                        <span>Projects</span>
                        <span className="text-ink-900">7 / 10</span>
                      </dt>
                      <ProgressBar value={70} className="mt-1.5" />
                    </div>
                    <div>
                      <dt className="flex justify-between text-[0.78rem] text-ink-500">
                        <span>Campaign budget used</span>
                        <span className="text-ink-900">€36,500 / €52,000</span>
                      </dt>
                      <ProgressBar value={70} tone="sky" className="mt-1.5" />
                    </div>
                  </dl>
                </Panel>
                <Panel title="Invoices" action="VAT compliant">
                  <table className="w-full text-left text-[0.82rem]">
                    <thead>
                      <tr className="text-[0.68rem] uppercase tracking-wide text-ink-400">
                        <th scope="col" className="pb-2 font-semibold">Reference</th>
                        <th scope="col" className="pb-2 font-semibold">Date</th>
                        <th scope="col" className="pb-2 font-semibold">Status</th>
                        <th scope="col" className="pb-2 text-right font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {[
                        { ref: "ASC-2026-0312", date: "2026-03-01", status: "Paid", amount: 5_240 },
                        { ref: "ASC-2026-0248", date: "2026-02-01", status: "Paid", amount: 4_890 },
                        { ref: "ASC-2026-0177", date: "2026-01-01", status: "Paid", amount: 6_120 },
                        { ref: "ASC-2025-0994", date: "2025-12-01", status: "Paid", amount: 3_450 },
                      ].map((invoice) => (
                        <tr key={invoice.ref} className="transition-colors hover:bg-canvas">
                          <td className="py-2.5 font-mono text-[0.76rem] text-ink-800">{invoice.ref}</td>
                          <td className="py-2.5 text-ink-500">{formatDate(invoice.date)}</td>
                          <td className="py-2.5">
                            <Badge tone="brand">{invoice.status}</Badge>
                          </td>
                          <td className="py-2.5 text-right font-semibold text-ink-900">
                            {formatCurrency(invoice.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Panel>
              </div>
            )}
          </div>
        </div>
      </div>
      {variant === "embedded" && (
        <p className="border-t border-line bg-white px-4 py-2.5 text-center text-[0.72rem] text-ink-400">
          Interactive preview with sample workspace data — switch tabs and projects to explore.
        </p>
      )}
    </div>
  );
}
