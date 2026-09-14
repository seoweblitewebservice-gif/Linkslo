import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/primitives";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { HydratedGig } from "@/lib/gigs/types";

const COVERS = [
  "from-[#063b32] via-[#08745d] to-[#3dbd95]",
  "from-[#173159] via-[#2f67ae] to-[#6ea7f0]",
  "from-[#55330f] via-[#a96918] to-[#f0b45c]",
  "from-[#432472] via-[#6b49c6] to-[#a08bf1]",
  "from-[#5b233a] via-[#a94468] to-[#ed82a3]",
  "from-[#18333c] via-[#345e6b] to-[#75aab4]",
] as const;

export function FeaturedGigs({ gigs }: { gigs: HydratedGig[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {gigs.map((gig, index) => {
        const standard = gig.packages.find((pkg) => pkg.tier === "standard") ?? gig.packages[0];
        return (
          <article key={gig.id} className="card-hover group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
            <Link href={`/marketplace/gigs/${gig.slug}`} className={`relative block h-32 overflow-hidden bg-gradient-to-br ${COVERS[index % COVERS.length]} p-5 text-white`}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)", backgroundSize: "30px 30px" }} />
              <span className="absolute -bottom-12 -right-8 h-32 w-32 rounded-full border-[20px] border-white/10" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex items-center justify-between"><span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/10"><Icon name="link" size={18} /></span><Badge tone="brand">Featured gig</Badge></div>
                <p className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-white/75">{gig.category}</p>
              </div>
            </Link>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-950 text-[0.62rem] font-semibold text-white">{gig.sellerInitials}</span>
                <span className="min-w-0 flex-1"><span className="flex items-center gap-1 truncate text-[0.76rem] font-semibold text-ink-900">{gig.sellerName}<Icon name="shield" size={12} className="text-brand-600" /></span><span className="block truncate text-[0.65rem] text-ink-400">{gig.sellerLevel} · {gig.sellerCountry}</span></span>
              </div>
              <h3 className="mt-3 line-clamp-2 font-display text-[0.95rem] font-semibold leading-snug text-ink-950 transition-colors group-hover:text-brand-700"><Link href={`/marketplace/gigs/${gig.slug}`}>{gig.title}</Link></h3>
              <div className="mt-3 flex items-center gap-2 text-[0.68rem] text-ink-400"><span className="inline-flex items-center gap-1 font-semibold text-ink-800"><Icon name="star" size={11} filled className="text-amber-accent" />{(gig.rating / 10).toFixed(1)}</span><span>({formatNumber(gig.reviewCount)})</span><span>·</span><span>{formatNumber(gig.ordersCompleted)} orders</span></div>
              <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
                <div><p className="text-[0.62rem] uppercase tracking-wide text-ink-400">Standard package</p><p className="mt-0.5 text-[0.7rem] font-medium text-ink-600">{standard?.quantity} · {standard?.deliveryDays} days</p></div>
                <p className="font-display text-[1rem] font-semibold text-ink-950">{standard ? formatCurrency(standard.price) : formatCurrency(gig.startingPrice)}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
