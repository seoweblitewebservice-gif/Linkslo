import type { articles } from "@/db/schema";

type ArticleRow = typeof articles.$inferInsert;

/**
 * Long-form blog posts (batch 1). Each includes a markdown body with H2/H3
 * structure, at least one comparison table, and a set of FAQs rendered as
 * both an on-page section and FAQPage schema. Written for Linkslo's own
 * marketplace — not copied from any reference site.
 */
export const BLOG_POSTS: ArticleRow[] = [
  {
    slug: "affordable-guest-posting-services-small-business",
    title: "9 Affordable Guest Posting Services for Small Businesses in 2026",
    category: "Guest Posting",
    excerpt:
      "A practical comparison of 9 guest posting options for small budgets — from single-domain marketplace orders to managed monthly campaigns — with what each is actually good for.",
    author: "Daniel Okoye",
    readingMinutes: 12,
    publishedOn: "2026-02-10",
    featured: true,
    faqs: JSON.stringify([
      {
        question: "How much does a guest post cost for a small business?",
        answer:
          "On the open marketplace, single placements typically run from around $40 on smaller niche sites up to several hundred dollars on well-known publications with high traffic and authority. Managed campaigns that include writing, outreach and reporting usually cost more per link because they bundle labour on top of the placement fee.",
      },
      {
        question: "Is it better to buy guest posts one at a time or as a monthly package?",
        answer:
          "One-at-a-time buying works well when you know exactly which sites you want and can review each pitch yourself. A monthly package makes more sense once you need consistent volume, since a strategist can plan anchor distribution and topic variety across placements instead of you managing each order separately.",
      },
      {
        question: "Do cheap guest posts hurt SEO?",
        answer:
          "A low price by itself doesn't hurt anything — what matters is whether the site is a genuine publication with real readers and an editorial process, or a page that exists only to sell links. Cheap placements on legitimate, relevant sites are fine. Bulk-cheap placements on link farms are the pattern to avoid.",
      },
      {
        question: "Can I write my own article for a guest post order?",
        answer:
          "Yes, most sellers and marketplaces allow you to supply your own draft. It still needs to clear the publisher's editorial guidelines, so expect some back-and-forth if the piece reads as promotional rather than useful to that site's readers.",
      },
      {
        question: "How long does a guest post take to go live after ordering?",
        answer:
          "Turnaround varies by publisher and package, but 5–15 business days is typical for a single placement once the topic is approved. Publishers with heavier editorial queues or exclusivity requirements can take longer.",
      },
    ]),
    body: `Small businesses rarely have the budget for a full-scale digital PR programme, but most still need a handful of relevant, editorially placed links to support a competitive page. The question isn't whether guest posting works — it's which version of it fits a limited budget without turning into a stack of low-quality placements that do nothing for rankings or reputation.

This guide compares nine ways small businesses actually buy guest posts today, what each is suited for, and where the trade-offs sit.

## Why Guest Posting Still Matters for Small Budgets

A single, well-placed guest post on a relevant site does three things a display ad or a directory listing can't: it puts your brand in front of an established audience, it signals topical relevance to search engines through the surrounding content, and it creates a durable asset that keeps working long after the invoice is paid.

The catch is that "guest post" now covers everything from a $35 placement on a small niche blog to a $2,000 sponsored feature on a national outlet. Matching the right tier to your actual goal is most of the work.

### What a Small Business Should Actually Look For

Before comparing services, it helps to be clear on what a placement needs to do for you:

- Reach an audience that overlaps with your customers, even loosely.
- Sit on a domain search engines already trust.
- Carry a link that fits naturally inside the article, not bolted onto a bio line.
- Come with enough information upfront (traffic, authority, niche) that you're not buying blind.

## 1. Single-Domain Marketplace Orders

This is the most transparent option available today: you browse individual publisher listings, each with its own price, authority score, estimated traffic and turnaround time, and you order the exact one you want.

**Best for:** businesses that already know which sites their competitors are getting links from, or that want full control over which domain a link comes from.

The main advantage is pricing clarity — you see the metrics and the cost before committing, rather than paying an agency to disclose the site after the invoice. The trade-off is that you're doing your own vetting on each order.

## 2. Niche Edit Placements

A niche edit adds your link into an existing, already-indexed article instead of publishing something new. It's usually faster and sometimes cheaper than a fresh guest post because there's no new content to write or wait on.

**Best for:** businesses that need a link live quickly and are comfortable with a slightly less prominent placement than a dedicated article.

The risk to watch for is relevance drift — a five-year-old post edited to fit an unrelated product reads as exactly what it is. A well-matched niche edit on a topically close article can be just as effective as a new post, at a lower cost.

## 3. Managed Guest Post Campaigns

Here you hand over a target page and a budget, and an agency or freelancer handles publisher outreach, writing, and reporting. You typically don't see every option — you approve a shortlist or trust the provider's judgement.

**Best for:** business owners who don't have time to review individual publisher metrics and would rather pay a bit more for a hands-off process.

## 4. Content-Included Packages

Some sellers bundle the article itself into the price, writing 700–1,200 words to the publisher's house style so you don't have to brief a writer separately.

**Best for:** businesses without an in-house writer, or ordering on unfamiliar topics where matching a publication's tone matters.

## 5. Bulk Discount Bundles

Ordering three, five or ten placements at once from the same seller or marketplace often comes with a modest per-link discount, since it reduces the number of separate transactions and conversations needed.

**Best for:** building out a first batch of links for a new page that currently has none, where getting several relevant placements live in the same window matters more than sourcing each one individually.

## 6. Industry-Specific Publisher Networks

Some marketplaces and agencies specialise in a single vertical — SaaS, finance, health, home services — and maintain relationships with publications in that space specifically.

**Best for:** businesses in a niche with recognisable trade publications, where a generic marketplace might not surface the right sites.

## 7. Local and Regional Placements

For businesses that serve a specific city or region, a link from a local news site, regional business journal or community blog can matter more than a generic higher-authority site with no geographic relevance.

**Best for:** service businesses, local retailers and anyone whose customers search with a location attached.

## 8. Freelance Outreach Specialists

Rather than a marketplace or agency, some businesses hire an individual freelancer to pitch publishers directly on their behalf, often at an hourly or per-placement rate.

**Best for:** businesses with a specific, narrow list of target publications they want approached personally rather than through a standing seller relationship.

## 9. Monthly Link Building Retainers

A retainer folds guest posting into a broader monthly programme alongside reporting, strategy and sometimes other link types like digital PR or resource link building.

**Best for:** businesses ready to treat link building as an ongoing function rather than a one-off project.

## Comparing the Options at a Glance

| Option | Typical Cost Range | Speed | Best When |
|---|---|---|---|
| Single-domain marketplace order | $40–$400 per link | 5–15 business days | You know which sites you want |
| Niche edit | $30–$250 per link | 3–10 business days | You need speed over prominence |
| Managed campaign | $150–$600 per link | 2–4 weeks | You want a hands-off process |
| Content-included package | $80–$350 per link | 1–2 weeks | You don't have a writer |
| Bulk bundle | 10–20% off per-link rate | Varies by batch size | You need volume fast |
| Industry-specific network | $100–$500 per link | 1–3 weeks | Your niche has trade publications |
| Local/regional placement | $50–$300 per link | 1–2 weeks | Your customers search locally |
| Freelance outreach | Hourly or per-placement | Varies | You have a specific target list |
| Monthly retainer | $500–$3,000+/month | Ongoing | You want a standing programme |

## How to Vet Any Option Before You Pay

Regardless of which format you choose, the same checks apply:

- Does the site publish regularly, or does it look dormant with a sudden run of sponsored posts?
- Is the traffic estimate distributed across many pages, or concentrated on one old viral post?
- Will the link sit inside the body of the article, in context, rather than in an author bio?
- Can you see the publisher's domain before you pay, or only after?

## Which Option Fits Your Business?

If you're ordering your first few links and want to see exactly what you're paying for, start with single-domain marketplace orders — you can compare authority, traffic and price side by side before committing. If you need something live fast, a niche edit on a relevant existing article is usually the quickest legitimate route. And if link building needs to become a habit rather than a one-time task, a monthly retainer keeps the work moving without you managing every order.

Whichever format you choose, the same rule holds: a placement is only worth paying for if a real visitor to that site would find your link relevant, not just a search engine.`,
  },

  {
    slug: "vet-guest-post-site-before-you-buy",
    title: "How to Vet a Guest Post Site Before You Buy: A DA, DR and Traffic Checklist",
    category: "Link Building",
    excerpt:
      "DA and DR are a starting filter, not proof of quality. Here's the checklist we use to separate genuine publishers from sites built only to sell links.",
    author: "Marta Ellison",
    readingMinutes: 9,
    publishedOn: "2026-02-18",
    featured: false,
    faqs: JSON.stringify([
      {
        question: "What is a good DA or DR for a guest post site?",
        answer:
          "There's no universal cutoff — a DA 25 site with a genuinely engaged niche audience can be more valuable than a DA 60 site padded with old, unrelated content. Treat DA/DR as a first filter to rule out obviously weak domains, then judge the rest on relevance and traffic quality.",
      },
      {
        question: "Can DA and DR scores be manipulated?",
        answer:
          "The scores themselves are calculated by third-party tools (Moz and Ahrefs, respectively) based on link profiles, and those link profiles can be built up artificially with low-quality links aimed specifically at inflating the score. That's why traffic distribution and content quality matter as much as the number itself.",
      },
      {
        question: "How do I check if a site's traffic is real?",
        answer:
          "Look at whether traffic is spread across many pages or concentrated on one or two posts, whether recent posts show any engagement (comments, social shares, updated dates), and whether the site ranks for anything beyond its own brand name in search.",
      },
      {
        question: "What's a red flag that a site is a link farm?",
        answer:
          "A high volume of clearly sponsored posts across unrelated topics, published in short bursts, with no bylines or generic 'admin' authors, and no evidence of an actual readership beyond the links themselves.",
      },
      {
        question: "Should I avoid sites with nofollow links?",
        answer:
          "Not necessarily. A nofollow link on a genuinely high-traffic, relevant site can still send real referral visitors and brand exposure. It won't pass the same authority signal as a dofollow link, but it isn't worthless.",
      },
    ]),
    body: `Domain Authority and Domain Rating are the first numbers most buyers look at when choosing a guest post site, and they're useful — as a filter, not as a verdict. Both metrics are modeled from backlink profiles, which means they can be inflated by exactly the kind of low-quality links a careful buyer is trying to avoid.

This is the checklist we run on every domain before it's listed on Linkslo, and it's the same process worth running yourself on any site you're considering, regardless of where you found it.

## Start With the Numbers, But Don't Stop There

DA (Moz) and DR (Ahrefs) estimate authority from backlink data using different methodologies, so the same site can show meaningfully different scores on each. Neither is issued by Google, and neither directly measures ranking potential — they measure the strength of a site's inbound link profile as that specific tool sees it.

Use them as a coarse filter: a site scoring near zero with almost no organic traffic is rarely worth pursuing regardless of price. Above that floor, the number stops being decisive on its own.

### Traffic Distribution Matters More Than Traffic Volume

A site showing 50,000 monthly visits sounds appealing until you check where that traffic goes. If it's concentrated on one old post that went viral in 2021 while everything else gets a handful of visits, a new guest post on that domain will likely sit in the quiet majority, not the exception.

What to check:

- Does traffic spread across dozens or hundreds of pages, or a handful?
- Are recent posts (last 3–6 months) getting any visible traffic at all?
- Does the site rank for terms beyond its own brand name?

### Editorial Signals Worth Checking

- **Bylines**: Real, consistent author names with some background, not "Admin" or "Staff" on every post.
- **Publishing cadence**: A steady rhythm over months or years reads differently than a burst of 40 posts in one week.
- **Comment and engagement patterns**: Even modest engagement suggests actual readers, not just crawlers.
- **Content-to-sponsorship ratio**: A site publishing twelve sponsored posts a week across unrelated industries is optimising for link sales, not readership.

## A Quick Reference Checklist

| Signal | What to Look For | Red Flag |
|---|---|---|
| DA / DR | Reasonable relative to niche and age | Extremely high score, near-zero traffic |
| Traffic distribution | Spread across many pages | Concentrated on 1–2 old posts |
| Recency | Regular posts in last 3 months | Long gaps, then a burst of sponsored content |
| Bylines | Named, consistent authors | Generic "admin" or no author shown |
| Niche fit | Content overlaps your industry | Random, unrelated topics |
| Link placement | In-body, contextual | Footer, sidebar, or author-bio only |
| Outbound link pattern | Mostly organic, some sponsored | Nearly all posts are sponsored |

## Relevance Beats Raw Authority

If a reasonable person browsing that site, with no interest in SEO, would plausibly click through to your page because it's useful to them, the placement is doing its job. If the only connection between the site and your business is a shared keyword, you're paying for a footprint on a domain, not an actual audience.

This is why a DA 35 site squarely in your industry, with modest but real traffic, is often a better buy than a DA 60 general-interest site that happens to have space for a sponsored post.

## Checking a Domain Yourself in Ten Minutes

1. Pull up the domain in a free backlink checker and scan the link profile for obvious spam patterns (foreign-language link farms, gambling or pharma sites linking in bulk).
2. Check 3–5 recent posts for bylines, publish dates and whether the content reads as genuinely useful.
3. Search "site:domain.com [your industry term]" to see if the site has organically covered your space before.
4. Look at where existing sponsored links sit on the page — in the body, or bolted onto a bio.

## The Bottom Line

DA and DR earn their place as a first-pass filter, but the domains worth paying for are the ones that would still make sense to appear on even if link value didn't exist — sites with real readers, a consistent editorial process, and enough topical overlap with your business that the placement reads as a genuine recommendation rather than a purchase.`,
  },

  {
    slug: "guest-posting-vs-niche-edits",
    title: "Guest Posting vs. Niche Edits: Which Link Building Method Fits Your Budget?",
    category: "Link Building",
    excerpt:
      "Both place a link on someone else's site — but they differ in speed, cost, prominence and risk. Here's how to decide which one your budget should go toward first.",
    author: "Sofia Lindqvist",
    readingMinutes: 8,
    publishedOn: "2026-02-24",
    featured: false,
    faqs: JSON.stringify([
      {
        question: "What's the main difference between a guest post and a niche edit?",
        answer:
          "A guest post is a brand-new article written specifically to be published, with your link included from the start. A niche edit inserts your link into an article that's already live and already indexed, without creating new content.",
      },
      {
        question: "Which is cheaper, guest posts or niche edits?",
        answer:
          "Niche edits are often slightly cheaper on average since there's no new article to write, but the actual price on any given site depends more on that domain's authority and traffic than on which format you choose.",
      },
      {
        question: "Are niche edits as effective as guest posts for SEO?",
        answer:
          "When the existing article is genuinely relevant to your link and the edit reads naturally, niche edits can perform comparably to guest posts. The risk is lower relevance, since you're fitting into content that wasn't written with your page in mind.",
      },
      {
        question: "Can a niche edit be removed later?",
        answer:
          "Yes — since you don't own the article, the publisher could update or remove the post at any point, taking your link with it. Reputable sellers will typically monitor and replace a removed niche edit link within an agreed window.",
      },
      {
        question: "Should I mix guest posts and niche edits in the same campaign?",
        answer:
          "Most link building programmes do. Niche edits fill in low-cost, fast-turnaround links, while guest posts anchor a campaign with new, highly relevant content on a chosen topic.",
      },
    ]),
    body: `Guest posts and niche edits both end with the same outcome — a link to your page on someone else's site — but they get there in different ways, and the difference changes how you should budget for each.

## What a Guest Post Actually Involves

A guest post is a new article, written to fit a publisher's editorial guidelines, submitted for approval, and published with your link embedded in the body. Because it's new content, it takes longer: someone has to write it, the publisher has to review and schedule it, and the whole process typically runs 5–15 business days from approval to live URL.

The upside is control. You (or your seller) choose the topic, the surrounding context, and exactly how the link is framed. A well-written guest post can also drive real referral traffic on its own, independent of any SEO value.

## What a Niche Edit Actually Involves

A niche edit — sometimes called a "curated link" or "link insertion" — adds your link into an article that's already published and already indexed. No new content is created; an editor finds a relevant paragraph in an existing post and inserts a sentence containing your link.

This is usually faster, since there's no writing or editorial review of a full new article involved. It can also be cheaper, because the publisher's cost to fulfil the order is lower.

## Where Niche Edits Fall Short

The article wasn't written with your page in mind, so relevance depends entirely on how good the match is between the existing content and what you're linking to. A well-matched niche edit — your project management tool linked from a three-year-old "best productivity tools" post — reads naturally. A poorly matched one is obvious to any reader who clicks through.

There's also a durability question: since you don't own the article, the publisher could update, rewrite or remove it later, taking your link along. Good sellers monitor this and replace lost links, but it's worth asking about upfront.

## Side-by-Side Comparison

| Factor | Guest Post | Niche Edit |
|---|---|---|
| Content | New article written for the placement | Inserted into existing article |
| Typical turnaround | 5–15 business days | 3–10 business days |
| Typical cost | Often slightly higher | Often slightly lower |
| Relevance control | High — you choose the topic | Depends on existing article match |
| Referral traffic potential | Higher (new, promoted content) | Lower (link sits in older content) |
| Durability | Stable once published | Can be edited/removed later |
| Best for | Anchoring a campaign, building brand presence | Fast, budget-friendly volume |

## How to Decide Where Your Budget Goes First

If you're starting from zero links on a page and want the strongest possible first impression, a guest post gives you more control over context and framing. If you already have some coverage and need to add volume efficiently, niche edits stretch a budget further without sacrificing much, provided the article match is genuinely relevant.

Most effective campaigns don't pick one exclusively — they use guest posts to establish a handful of strong, well-framed placements on priority pages, then fill in supporting volume with niche edits on well-matched existing content.

## A Simple Rule of Thumb

Ask what the link needs to do. If it needs to anchor a new page with no existing coverage, write something new. If it needs to add incremental relevance to a page that already has some links, a well-matched niche edit is usually the more efficient spend.`,
  },

  {
    slug: "how-much-should-you-pay-for-a-guest-post",
    title: "How Much Should You Pay for a Guest Post in 2026? (Real Pricing Data)",
    category: "Guest Posting",
    excerpt:
      "Guest post prices range from under $50 to well over $1,000 for the same-sounding service. Here's what actually drives the price, using real listing data.",
    author: "Daniel Okoye",
    readingMinutes: 8,
    publishedOn: "2026-03-01",
    featured: true,
    faqs: JSON.stringify([
      {
        question: "What is a fair price for a guest post?",
        answer:
          "There's a wide legitimate range. A relevant niche site with modest traffic might reasonably charge $40–$100, while a well-known publication with significant organic traffic can justify $300–$1,000+. The fair price depends on the site's actual metrics, not a flat industry number.",
      },
      {
        question: "Why do guest post prices vary so much between sites?",
        answer:
          "Price mainly tracks domain authority, organic traffic and niche competitiveness. A finance or SaaS site with high commercial intent traffic usually costs more than a general lifestyle blog with similar authority, because advertisers compete harder for that audience.",
      },
      {
        question: "Is a $20 guest post ever worth it?",
        answer:
          "Occasionally, on a small but genuinely relevant niche site with real (if modest) traffic. Treat very low prices as a reason to check the site more carefully, not as an automatic red flag — some small publishers price low simply because their traffic is low, not because the link is fake.",
      },
      {
        question: "Do higher DA sites always cost more?",
        answer:
          "Generally yes, but not always — a high-DA site with declining or thin traffic sometimes prices lower than its authority score would suggest, because sellers price based on actual demand as much as the raw metric.",
      },
      {
        question: "Should I negotiate guest post prices?",
        answer:
          "On individual marketplace listings, prices are usually fixed. For bulk orders or ongoing relationships with a specific publisher, it's reasonable to ask about a volume discount.",
      },
    ]),
    body: `Ask five people what a guest post should cost and you'll get five different numbers, and all of them might be right — for the specific site they had in mind. Pricing in this market isn't arbitrary, but it also isn't standardised, which makes it easy for a buyer to either overpay for a low-value site or underpay expectations for a genuinely strong one.

Here's what actually moves the number, based on the pricing patterns across thousands of active listings.

## The Core Drivers of Guest Post Pricing

### Domain Authority and Domain Rating

These remain the most visible inputs, and sellers price around them because buyers ask about them first. But authority alone doesn't set price — it sets a rough tier that traffic and niche then adjust up or down.

### Organic Traffic

Two sites with identical DA can have wildly different traffic, and traffic tends to matter more to price than the authority score itself. A site pulling in tens of thousands of monthly visits justifies a higher price than a similarly-scored site getting a few hundred.

### Niche and Commercial Intent

Finance, legal, SaaS and health sites typically command higher prices than general lifestyle or hobby blogs at the same authority level, because advertisers in those niches have historically paid more for placements — the guest post market reflects that broader ad-value pattern.

### Link Type

Dofollow links generally cost more than nofollow, since they pass a stronger authority signal. Some publishers only offer nofollow due to their own editorial policy, which typically shows up as a lower price for the placement.

### Content Requirements

If the price includes the publisher (or seller) writing the article, expect a premium over a listing where you supply your own draft. Word count minimums and topic restrictions can also affect price.

## Typical Price Ranges by Site Tier

| Site Tier | Typical DA Range | Typical Monthly Traffic | Typical Price |
|---|---|---|---|
| Small niche blog | 15–35 | Under 5,000 | $30–$100 |
| Established niche site | 30–55 | 5,000–50,000 | $80–$250 |
| Strong industry publication | 50–70 | 50,000–250,000 | $200–$600 |
| Major outlet / high-traffic site | 70+ | 250,000+ | $500–$2,000+ |

These ranges overlap deliberately — a small niche site in a high-value vertical like finance can out-price a larger general-interest site, and a big outlet with declining relevance can sometimes be found cheaper than its authority score implies.

## When a Price Looks Too Good

A guest post at $15–$20 on a site claiming DA 50+ and six-figure traffic is worth extra scrutiny before ordering. Check the traffic distribution and recent post engagement rather than assuming the price alone confirms or denies the site's value — some listings are simply underpriced by a seller who hasn't updated rates, and some are inflated metrics on a thin site.

## What You're Really Paying For

Beyond the number itself, a guest post price is buying three things: the audience the domain has already built, the trust search engines have already assigned it, and the editorial process that makes the placement look — and function — like a genuine recommendation rather than a paid insert.

When comparing two similarly priced sites, the tie-breaker is usually relevance: the site closer to your actual industry, even at a slightly lower traffic number, tends to be the better buy.

## A Practical Budgeting Approach

Rather than setting a flat per-link budget, decide what tier of site actually matters for the page you're building links to. A competitive commercial page usually justifies at least a few placements from the "established niche" or "strong industry publication" tiers. A lower-priority supporting page can often be served well by smaller, cheaper, but still genuinely relevant sites.`,
  },

  {
    slug: "do-guest-posts-still-work-for-seo",
    title: "Do Guest Posts Still Work for SEO in 2026?",
    category: "Link Building",
    excerpt:
      "Guest posting has been declared 'dead' every year for over a decade. Here's what actually changed, what didn't, and how to tell if a placement is still worth doing.",
    author: "Marta Ellison",
    readingMinutes: 7,
    publishedOn: "2026-03-08",
    featured: false,
    faqs: JSON.stringify([
      {
        question: "Is guest posting against Google's guidelines?",
        answer:
          "Guest posting itself isn't against guidelines — publishing genuinely useful content on other sites is a normal part of the web. What Google's guidelines target is link schemes: guest posts published purely to manipulate rankings, with no editorial value, often at scale and with exact-match anchor text.",
      },
      {
        question: "Why do some SEOs say guest posting doesn't work anymore?",
        answer:
          "Usually because they're describing the low-quality, mass-produced version — thin articles on link-farm networks with no real readership. That version has genuinely lost effectiveness. Editorial placements on real, relevant publications still contribute value.",
      },
      {
        question: "Do I need to disclose sponsored guest posts?",
        answer:
          "Search engines ask that paid links use a nofollow, sponsored, or ugc attribute rather than passing full follow authority, which is why many publishers mark guest post links accordingly. Whether a specific placement is dofollow or nofollow depends on that publisher's own editorial policy.",
      },
      {
        question: "How many guest posts do I need to see a ranking improvement?",
        answer:
          "There's no fixed number — it depends on your current link profile, competition for the target keyword, and the quality of the placements themselves. A handful of highly relevant, well-placed links often outperforms a much larger number of generic ones.",
      },
      {
        question: "What matters more now: link quantity or link quality?",
        answer:
          "Quality, and the gap has widened over time. A small number of relevant, editorially genuine placements tends to outperform a large volume of low-relevance links, particularly as search engines have gotten better at discounting obvious link-scheme patterns.",
      },
    ]),
    body: `Every year brings a fresh round of "guest posting is dead" posts, and every year, sites keep getting genuine editorial placements and keep seeing them contribute to rankings. Both things can be true at once, because "guest posting" describes two very different practices that happen to share a name.

## The Version That Stopped Working

Somewhere in the last decade, guest posting scaled into an industry of its own — networks of thin sites built specifically to host sponsored articles, syndicated across dozens of near-identical domains, stuffed with exact-match anchor text, and sold in bulk packages priced by volume rather than relevance.

Search engines caught up to this pattern. Sites in these networks lost authority, got deindexed, or simply stopped passing meaningful value, and the links pointing from them followed. If your mental model of "guest posting" is this version, it's fair to say it stopped working — because it did.

## The Version That Still Works

A genuinely different practice runs alongside it: pitching a real, relevant publication with a real audience, writing something that publication's editors would accept even without a link attached, and getting it published through the same editorial process any other contributor goes through.

This version hasn't stopped working because it was never a scheme to begin with — it's closer to what digital PR and content marketing teams call "earned media," except you're doing some of the earning by writing the piece yourself rather than waiting for a journalist to notice you.

## What Actually Changed

### The Bar for "Relevant" Got Higher

A tenuous keyword connection used to be enough to justify a placement. Now, the site's overall topical focus and the specific article's context both need to make sense together, or the placement contributes little beyond a passing mention.

### Anchor Text Patterns Get More Scrutiny

Heavy use of exact-match commercial anchors ("best accounting software" linked from every guest post) reads as manipulation more clearly today than it once did. Natural, varied anchor text — including branded and generic phrases — better reflects how real writers actually link.

### Site-Level Signals Matter More Than Individual Links

A single strong placement on a thin, low-quality domain contributes less than the same placement would on a site with a genuine editorial history, because search engines increasingly evaluate the linking site's overall trustworthiness, not just the presence of a link.

## How to Tell if a Placement Is Worth Doing

Run through these questions before ordering:

- Would this article make sense on this site even if my link weren't in it?
- Does the site have other content in this general topic area?
- Is the anchor text natural in context, or does it read as inserted?
- Would a real reader of this site plausibly click through to my page?

If the honest answer to most of these is yes, the placement belongs to the version of guest posting that still works.

## A Quick Comparison

| Signal | Still Works | Stopped Working |
|---|---|---|
| Site has real, varied content | Yes | Mostly sponsored posts only |
| Anchor text | Natural, varied | Exact-match, repetitive |
| Topical fit | Genuine overlap | Loose or forced connection |
| Publishing pattern | Steady over time | Sudden bulk publishing |
| Audience | Real, even if small | None beyond link buyers |

## The Bottom Line

Guest posting as a category didn't stop working — the low-effort, high-volume version of it did, and that's the version most "guest posting is dead" arguments are actually describing. Editorial placements on genuine, relevant publications remain one of the more durable ways to build both authority and real audience exposure, provided each one is chosen the way you'd choose where to submit an article if links weren't part of the equation at all.`,
  },
];
