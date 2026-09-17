import type { articles } from "@/db/schema";

type ArticleRow = typeof articles.$inferInsert;

/**
 * Long-form blog posts. Each targets a specific long-tail keyword phrase,
 * runs 2,000+ words with H2/H3 structure, at least one comparison table,
 * inline internal links to relevant pages on the site, and a set of FAQs
 * rendered as both an on-page section and FAQPage schema.
 */
export const BLOG_POSTS: ArticleRow[] = [
  {
    slug: "affordable-guest-posting-services-small-business",
    title: "9 Affordable Guest Posting Services for Small Businesses in 2026",
    category: "Guest Posting",
    excerpt:
      "A practical comparison of 9 guest posting options for small budgets — from single-domain marketplace orders to managed monthly campaigns — with what each is actually good for.",
    author: "Daniel Okoye",
    readingMinutes: 14,
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
      {
        question: "What's the smallest realistic budget to start guest posting?",
        answer:
          "You can order a single, relevant placement on a small niche site for as little as $30–$50. A more realistic starting budget for a first real batch — enough to see whether the channel is worth expanding — is usually $200–$400 for three to five well-chosen placements.",
      },
    ]),
    body: `Small businesses rarely have the budget for a full-scale digital PR programme, but most still need a handful of relevant, editorially placed links to support a competitive page. The question isn't whether guest posting works — it's which version of it fits a limited budget without turning into a stack of low-quality placements that do nothing for rankings or reputation.

This guide compares nine ways small businesses actually buy guest posts today, what each is suited for, and where the trade-offs sit. If you want to skip straight to browsing real, price-listed sites rather than reading about them, our [guest post marketplace](/marketplace) lists thousands of publishers with authority, traffic and price shown upfront.

## Why Guest Posting Still Matters for Small Budgets

A single, well-placed guest post on a relevant site does three things a display ad or a directory listing can't: it puts your brand in front of an established audience, it signals topical relevance to search engines through the surrounding content, and it creates a durable asset that keeps working long after the invoice is paid.

The catch is that "guest post" now covers everything from a $35 placement on a small niche blog to a $2,000 sponsored feature on a national outlet. Matching the right tier to your actual goal is most of the work, and it's worth reading our breakdown of [how much you should actually pay for a guest post](/resources/how-much-should-you-pay-for-a-guest-post) before you commit a budget.

### What a Small Business Should Actually Look For

Before comparing services, it helps to be clear on what a placement needs to do for you:

- Reach an audience that overlaps with your customers, even loosely.
- Sit on a domain search engines already trust.
- Carry a link that fits naturally inside the article, not bolted onto a bio line.
- Come with enough information upfront — traffic, authority, niche — that you're not buying blind. Our guide on [how to vet a guest post site before you buy](/resources/vet-guest-post-site-before-you-buy) covers exactly what to check.

## 1. Single-Domain Marketplace Orders

This is the most transparent option available today: you browse individual publisher listings, each with its own price, authority score, estimated traffic and turnaround time, and you order the exact one you want.

**Best for:** businesses that already know which sites their competitors are getting links from, or that want full control over which domain a link comes from.

The main advantage is pricing clarity — you see the metrics and the cost before committing, rather than paying an agency to disclose the site after the invoice. The trade-off is that you're doing your own vetting on each order, which is why a checklist matters more here than with any other option on this list.

## 2. Niche Edit Placements

A [niche edit](/backlinks/niche-edit-backlinks) adds your link into an existing, already-indexed article instead of publishing something new. It's usually faster and sometimes cheaper than a fresh guest post because there's no new content to write or wait on.

**Best for:** businesses that need a link live quickly and are comfortable with a slightly less prominent placement than a dedicated article.

The risk to watch for is relevance drift — a five-year-old post edited to fit an unrelated product reads as exactly what it is. A well-matched niche edit on a topically close article can be just as effective as a new post, at a lower cost. We cover the full trade-off in [guest posting vs. niche edits](/resources/guest-posting-vs-niche-edits).

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

## How to Budget Your First Guest Posting Campaign

A common mistake with a first campaign is spreading a small budget too thin across too many placements, ending up with five links on marginal sites instead of two or three on genuinely good ones. Work backwards from the page you're trying to support:

1. **Pick one priority page** — a service page, a comparison page, or a piece of cornerstone content — rather than spreading links across your whole site at once.
2. **Set a per-link quality floor**, not just a total budget. Deciding "nothing under a real, checkable audience" before you start browsing listings stops budget pressure from lowering your standards mid-search.
3. **Reserve at least one placement for a higher-tier site**, even if it means fewer total links. One strong, relevant placement usually outperforms three marginal ones.
4. **Leave room to react** — if a great, slightly pricier site turns up while you're browsing, having 15–20% of budget unallocated lets you take it without cutting into your other placements.

A workable first run for many small businesses looks like $250–$400 spread across three to five placements: one from a stronger, higher-traffic site, and the rest from smaller but genuinely relevant niche publications.

## Mistakes That Waste a Small Guest Posting Budget

- **Chasing DA/DR without checking traffic.** A high authority score on a domain with almost no real visitors contributes far less than a modest score on a site people actually read.
- **Ordering from unrelated niches because the price was low.** A cheap placement on a topic with no connection to your business is rarely worth it even at a low cost.
- **Skipping the anchor text conversation.** Letting every placement default to the same commercial anchor phrase creates a pattern that looks manufactured rather than natural.
- **Treating one placement as a complete strategy.** A single guest post rarely moves a competitive page on its own — it's one input among several.

## A Worked Example: Spending $350 on a First Campaign

To make the budgeting advice above concrete, here's how a $350 first campaign might realistically break down for a small local services business targeting one commercial page:

- **$150** on one established niche site directly in their industry, DA in the low 40s, with a genuinely engaged readership — this is the anchor placement.
- **$120** split across two smaller but relevant niche blogs, DA in the 20s-30s, each with modest but real traffic in an adjacent topic area.
- **$80** on a local or regional publication relevant to their service area, since local relevance often matters as much as raw authority for a business serving a specific region.

That's three to four placements, a mix of authority levels, and a deliberate choice to put the largest single spend on the strongest, most relevant site rather than spreading it evenly. The exact numbers will shift depending on your industry and location, but the shape — one anchor placement plus a few supporting ones — holds up across most small business campaigns.

## How to Track Whether It's Working

Before you order anything, decide what you'll actually check afterward. At minimum:

- Confirm each link went live where and how it was promised — in the body of the article, not a bio line, and pointing to the agreed target page.
- Note the publish date so you have a reference point for when to expect any ranking movement, which typically shows up over 6–12 weeks rather than immediately.
- Keep a simple log of which site, which anchor text, and which package tier for each order, so a future campaign can learn from what worked.

This doesn't need to be elaborate — a basic spreadsheet is enough for a small business running a handful of placements a quarter.

## Scaling Up Once the First Batch Works

If your first small campaign shows movement — more referral traffic, better rankings on the target page, or simply confirmation that the placements were genuine and well-received — the natural next step is deciding how to scale without losing the discipline that made the first batch work. The temptation at this stage is to increase volume quickly, but the businesses that get the most out of guest posting over time tend to scale the budget per placement before scaling the number of placements: moving from mostly small niche sites toward a mix that includes a few stronger, more established publications, rather than simply ordering more of the same tier. A steady monthly rhythm of three to five well-chosen placements, sustained over six months, generally outperforms an equivalent one-time burst of fifteen to twenty links ordered all at once, both because it looks more natural and because it gives you room to adjust based on what the first few months show you.

## Which Option Fits Your Business?

If you're ordering your first few links and want to see exactly what you're paying for, start with single-domain marketplace orders — you can compare authority, traffic and price side by side before committing. If you need something live fast, a niche edit on a relevant existing article is usually the quickest legitimate route. And if link building needs to become a habit rather than a one-time task, a monthly retainer keeps the work moving without you managing every order.

Whichever format you choose, the same rule holds: a placement is only worth paying for if a real visitor to that site would find your link relevant, not just a search engine. Browse [real, price-listed guest post sites](/marketplace) with authority and traffic shown upfront, or [get in touch](/contact) if you'd rather talk through a plan first.`,
  },

  {
    slug: "vet-guest-post-site-before-you-buy",
    title: "How to Vet a Guest Post Site Before You Buy: A DA, DR and Traffic Checklist",
    category: "Link Building",
    excerpt:
      "DA and DR are a starting filter, not proof of quality. Here's the checklist we use to separate genuine publishers from sites built only to sell links.",
    author: "Marta Ellison",
    readingMinutes: 13,
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
      {
        question: "How long should vetting a single site take?",
        answer:
          "With practice, a solid pass takes about ten minutes per domain: a quick backlink profile scan, a look at three or four recent posts, and a search check for existing topical coverage. It's faster than it sounds once you know what you're looking for.",
      },
    ]),
    body: `Domain Authority and Domain Rating are the first numbers most buyers look at when choosing a guest post site, and they're useful — as a filter, not as a verdict. Both metrics are modeled from backlink profiles, which means they can be inflated by exactly the kind of low-quality links a careful buyer is trying to avoid.

This is the checklist we run on every domain before it's listed on the [Linkslo marketplace](/marketplace), and it's the same process worth running yourself on any site you're considering, regardless of where you found it.

## Start With the Numbers, But Don't Stop There

DA (Moz) and DR (Ahrefs) estimate authority from backlink data using different methodologies, so the same site can show meaningfully different scores on each. Neither is issued by Google, and neither directly measures ranking potential — they measure the strength of a site's inbound link profile as that specific tool sees it.

Use them as a coarse filter: a site scoring near zero with almost no organic traffic is rarely worth pursuing regardless of price. Above that floor, the number stops being decisive on its own, and that's where the rest of this checklist takes over. If you're also weighing what a fair price looks like once a site clears these checks, our guide on [guest post pricing](/resources/how-much-should-you-pay-for-a-guest-post) breaks that down by tier.

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

## Free Tools You Can Use to Check These Signals Yourself

You don't need a paid SEO subscription to run most of this checklist:

1. **A free-tier backlink checker** (most major SEO tool providers offer a limited free lookup) to scan the domain's inbound link profile for obvious spam clusters — bulk links from unrelated foreign-language sites, gambling or pharma domains linking in volume, or a suspicious concentration of links from a handful of similar-looking blogs.
2. **The site's own search results**, using a "site:domain.com" search alongside your industry term, to see whether the publication has organically covered your space before you ever reached out.
3. **A quick scroll through the last 10–15 published posts**, checking dates, bylines and whether the topics vary naturally or repeat the same sponsored pattern.
4. **The Wayback Machine**, if you want to see whether a domain has a long history as a real site or was recently repurposed — a sudden change from years of unrelated content to a run of guest posts is a meaningful signal on its own.

None of this takes long once it's a habit, and it catches the great majority of low-quality domains before you spend anything.

## What We Check Before Listing a Site on Linkslo

Every publisher on our [guest post marketplace](/marketplace) goes through a version of this same process before it's listed with a price: a traffic and authority check, a scan for topical consistency across recent posts, and a review of how outbound links are actually placed in the content. Listings show real DA, DR, and traffic figures rather than a single opaque "quality score," specifically so you can apply your own judgment rather than trust a black box.

## Real Examples: A Site Worth Buying vs. One to Avoid

**Worth buying:** A mid-sized site in the home improvement space, DA in the low 40s, traffic spread across seasonal guides and product roundups, with a consistent posting cadence and named authors. A handful of its recent posts are sponsored, but most aren't, and the topics stay within its niche.

**Worth avoiding:** A domain showing DA in the high 50s with almost all of its estimated traffic concentrated on a single unrelated post from several years ago. Recent activity is a cluster of sponsored articles covering finance, health supplements, and software — unrelated to each other and to the site's original focus. The authority score looks appealing, but it's not attached to anything a real, ongoing audience would encounter.

The second example is the pattern worth remembering: a strong number attached to a site that no longer resembles a publication.

## Common Objections Sellers Give and What They Really Mean

When you ask pointed questions about a site's traffic or editorial process, sellers respond in fairly predictable ways. It helps to know how to read between the lines:

- **"Our traffic tool shows different numbers"** — reasonable if the gap is modest, since different tools estimate traffic differently. A gap of 10x or more is worth independent verification, not just taking the higher number.
- **"We can't share the exact domain until payment"** — a significant red flag on an individual order. Reputable marketplace listings and direct publisher relationships show you the domain upfront specifically so you can vet it first.
- **"This site doesn't do bylines for guest content"** — not necessarily disqualifying if everything else checks out, but worth weighing against otherwise-similar sites that do credit authors.
- **"We guarantee permanent placement"** — a reasonable claim if backed by a stated replacement policy; a vague guarantee with no specifics is worth pressing on.

## A Worked Example: Comparing Two Similarly Priced Listings

Say you're choosing between two sites, both priced around $150 for a guest post. Site A shows DA 45, traffic concentrated on a handful of older posts, and a byline of "Editorial Team" on every recent article. Site B shows DA 38, traffic spread across dozens of recent posts, and named authors with visible history writing in your industry.

On paper, Site A's higher DA looks like the better deal. In practice, Site B is very likely the stronger buy — the traffic pattern suggests an actual ongoing readership, and the named authors suggest a real editorial process rather than a rotating cast of ghost-written sponsored content. This is exactly the kind of case where running the full checklist changes the decision that DA alone would have made.

## What to Do When a Site Fails Part of the Checklist

Not every site needs to pass every check perfectly. A small, genuinely relevant niche blog might have modest traffic and no dramatic red flags — that's a reasonable buy at a price that matches its size. The checklist is most useful for catching sites that combine an impressive-looking number with clear signs the number doesn't reflect a real, active publication. When a site fails on relevance specifically — good metrics, but nothing to do with your industry — that's usually the clearest reason to pass, regardless of how the rest of the checklist looks.

## Building Your Own Vetting Habit Over Time

The checklist in this guide takes longer the first few times you run it and gets noticeably faster with practice, mostly because you start recognising patterns rather than checking each signal from scratch. After vetting a few dozen sites, most buyers develop a rough intuition — a site "feels" thin within the first thirty seconds of browsing its recent posts, well before any formal check confirms it. That intuition is worth trusting as a first filter, but it's still worth running the fuller checklist on anything you're about to spend real money on, since intuition can miss a well-disguised thin site just as easily as it can flag a genuinely good one incorrectly.

It's also worth keeping a short running list of sites you've vetted and rejected, along with the specific reason — this becomes useful both for your own future reference and for spotting whether a particular seller keeps offering you the same weak domains under slightly different framing.

## How Vetting Standards Should Shift by Campaign Goal

Not every placement needs to clear the same bar. A link intended purely to build broad topical authority around your site can reasonably use a slightly lower vetting standard than a link going directly on your highest-priority commercial page, where a poor placement could actively work against you if the site turns out to be low quality. Being explicit about which standard applies to which order — rather than applying one blanket rule to every purchase — lets you stretch a budget further on lower-stakes links while still holding your most important placements to a stricter check. This is also a useful way to allocate time: spend the full ten-minute check on anything going to a priority page, and a faster pass on smaller supporting links where the downside of an occasional miss is limited.

## Final Checklist Before You Click Buy

Before finalising any order, run through this short version of everything above: the site's DA/DR sits in a reasonable range for its niche and age; traffic is spread across multiple recent pages rather than one old post; recent content has real, consistent bylines; the topic overlaps genuinely with your industry; and the link will sit inside the article body rather than a footer or bio. If all five hold up, you're very likely buying a genuine placement rather than a footprint on a domain that used to matter, and you can move on to comparing it against the [pricing guidance](/resources/how-much-should-you-pay-for-a-guest-post) to make sure the number matches what you're actually getting.

## Relevance Beats Raw Authority

If a reasonable person browsing that site, with no interest in SEO, would plausibly click through to your page because it's useful to them, the placement is doing its job. If the only connection between the site and your business is a shared keyword, you're paying for a footprint on a domain, not an actual audience.

This is why a DA 35 site squarely in your industry, with modest but real traffic, is often a better buy than a DA 60 general-interest site that happens to have space for a sponsored post — a pattern we cover in more detail in [do guest posts still work for SEO](/resources/do-guest-posts-still-work-for-seo).

## The Bottom Line

DA and DR earn their place as a first-pass filter, but the domains worth paying for are the ones that would still make sense to appear on even if link value didn't exist — sites with real readers, a consistent editorial process, and enough topical overlap with your business that the placement reads as a genuine recommendation rather than a purchase. Once you've found a site that clears this checklist, you can [browse similar vetted listings](/marketplace) with the same metrics shown upfront.`,
  },

  {
    slug: "guest-posting-vs-niche-edits",
    title: "Guest Posting vs. Niche Edits: Which Link Building Method Fits Your Budget?",
    category: "Link Building",
    excerpt:
      "Both place a link on someone else's site — but they differ in speed, cost, prominence and risk. Here's how to decide which one your budget should go toward first.",
    author: "Sofia Lindqvist",
    readingMinutes: 12,
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
      {
        question: "How do I know which existing article a niche edit will go into?",
        answer:
          "A reputable seller will tell you the exact article and let you review the surrounding context before the link goes live, rather than inserting it and reporting back afterward.",
      },
    ]),
    body: `Guest posts and niche edits both end with the same outcome — a link to your page on someone else's site — but they get there in different ways, and the difference changes how you should budget for each.

## What a Guest Post Actually Involves

A [guest post](/backlinks/guest-post-backlinks) is a new article, written to fit a publisher's editorial guidelines, submitted for approval, and published with your link embedded in the body. Because it's new content, it takes longer: someone has to write it, the publisher has to review and schedule it, and the whole process typically runs 5–15 business days from approval to live URL.

The upside is control. You (or your seller) choose the topic, the surrounding context, and exactly how the link is framed. A well-written guest post can also drive real referral traffic on its own, independent of any SEO value.

## What a Niche Edit Actually Involves

A [niche edit](/backlinks/niche-edit-backlinks) — sometimes called a "curated link" or "link insertion" — adds your link into an article that's already published and already indexed. No new content is created; an editor finds a relevant paragraph in an existing post and inserts a sentence containing your link.

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

## A Closer Look at Cost Per Link Over Time

The sticker price on a single order doesn't tell the whole story. Guest posts that include content writing carry a labour cost baked into the price, which is a one-time expense — once published, there's nothing more to pay for that link. Niche edits often look cheaper up front, but if a publisher's article gets updated or deprecated and your link needs replacing down the line, that's a second cost you weren't necessarily planning for.

Over a 12-month campaign, a mix tends to average out: guest posts anchor the campaign with durable, on-topic placements, while niche edits add volume at a lower per-link cost, accepting a slightly higher chance that some will need monitoring or replacement.

## How to Combine Both in a Single Campaign

A workable split for a mid-sized campaign — say, ten links aimed at one priority page — often looks like this:

- **Three to four guest posts** on the most relevant, higher-authority sites you can find, each written specifically to support the target page.
- **Six to seven niche edits** spread across smaller or already-established articles that closely match the topic, filling out volume at a lower average cost.

This isn't a fixed formula — a page in a niche with very few relevant existing articles to edit into will lean more heavily on fresh guest posts by necessity, while a well-covered topic with lots of existing content might support a more even split.

## Questions to Ask a Seller Before You Order Either

- For a guest post: Who writes the article — you, or the seller — and how many revision rounds are included if the publisher requests changes?
- For a niche edit: Which specific article will the link go into, and can you review it before the edit goes live?
- For both: What happens if the placement is rejected, removed, or the publisher's policy changes after you've paid?
- For both: Is there a written replacement or refund policy if the link disappears within an agreed monitoring window?

A seller who can answer these clearly before you order is generally more reliable than one who treats the process as a black box.

## How Anchor Text Differs Between the Two Formats

With a guest post, you're writing (or commissioning) the article from scratch, which means you control exactly where the anchor text sits and how many times your target page gets mentioned. This makes it easier to keep anchor text varied and natural-sounding across a campaign — branded mentions, generic phrases, and the occasional exact-match anchor, in a mix that reads like something a real writer would produce.

With a niche edit, you're constrained by the existing article's structure. A good editor will find a sentence where your link fits naturally, but you have less control over the exact phrasing than you would writing fresh content. This isn't necessarily a downside — a link that's clearly been fitted into someone else's writing, using their sentence structure, can actually look more organic than a guest post with suspiciously on-brand phrasing throughout.

## A Worked Example: Splitting a $500 Budget

Consider a $500 budget aimed at supporting one commercial page that currently has no backlinks pointing to it. A reasonable split:

- **Two guest posts** (roughly $150 each, $300 total) on relevant niche sites, each written to introduce the page's topic naturally within useful, on-topic content.
- **Four niche edits** (roughly $50 each, $200 total) on well-matched existing articles, adding supporting volume at a lower cost per link.

This gives the page six total links from six different domains — a healthier pattern than concentrating the same budget into two or three more expensive placements — while still anchoring the campaign with content written specifically for the purpose.

## When Niche Edits Are Clearly the Better Choice

There are situations where niche edits aren't just a budget compromise — they're genuinely the better format. If you're adding a citation-style link to a resource, a tool, or a piece of data that fits naturally into "further reading" style content that already exists across many sites, a niche edit often looks more natural than a purpose-written guest post would, since resource mentions are exactly the kind of thing that gets added to existing articles as they're updated over time.

## When Guest Posts Are Clearly the Better Choice

The reverse holds when you're introducing something genuinely new — a product launch, an original piece of research, a service offering that didn't exist when older articles in your niche were written. There's no existing article to edit into that would make sense; the only natural way to get coverage is through content written with that specific news in mind. This is also the case for launching into a brand-new topic area your business hasn't been associated with before, where there simply isn't a backlog of relevant existing articles anywhere to insert a link into.

## Questions About Cost Aren't the Only Consideration

It's easy to reduce this decision to pure cost-per-link, but the two formats also differ in how much referral traffic they're likely to send. A brand-new guest post on a site that actively promotes new content — through its own newsletter, social channels, or homepage — can drive real visitors well beyond any SEO value. A niche edit added quietly to page four of an old archive is far less likely to be seen by anyone browsing the site currently, even though it may still carry authority in search engines' eyes.

## How These Formats Fit Into a Longer-Term Strategy

Over a full year of link building, the guest post versus niche edit question tends to answer itself once you're tracking a portfolio of pages rather than a single one. New, high-priority pages — a fresh product launch, a newly redesigned service page — generally deserve guest posts first, since there's no existing content anywhere that could be edited to support them. Older, established pages that already rank reasonably well but could use incremental authority are often better served by niche edits, since the marginal gain from another well-matched existing article tends to be worth more than its lower cost would suggest. Thinking in terms of a page's lifecycle — new versus established — is often a more useful lens than trying to pick one format as generally superior to the other.

## A Final Word on Mixing Sellers

Many buyers default to sourcing every link, guest post or niche edit alike, from a single agency or seller for convenience. There's nothing wrong with that once you trust the relationship, but it's worth knowing that most experienced buyers eventually diversify — using a marketplace for guest posts where they want visibility into exact metrics before ordering, and a specialist niche edit provider where speed and existing-article fit matter more than browsing options themselves. Diversifying sellers also naturally diversifies the pool of domains your links come from, which tends to look healthier than a link profile where every placement traces back to the same handful of relationships. It also means a single seller having a bad quarter, or quietly lowering their editorial standards, doesn't put your entire link building programme at risk at once.

## Putting It All Together

There's no universally correct answer to guest posting versus niche edits — the right choice depends on whether the page you're supporting is new or established, how much control you need over the exact content and anchor text, and how your budget is best allocated across a handful of strong placements versus a larger number of supporting ones. Most campaigns that perform well over time end up using both, in a ratio that shifts as pages mature from newly published to well-established. Starting with a clear view of what stage each of your priority pages is at makes this decision considerably easier than trying to pick one format as the default for every situation, and checking [current pricing](/resources/how-much-should-you-pay-for-a-guest-post) for both formats before you commit a budget helps confirm the split still makes sense once real numbers are on the table.

## How to Decide Where Your Budget Goes First

If you're starting from zero links on a page and want the strongest possible first impression, a guest post gives you more control over context and framing. If you already have some coverage and need to add volume efficiently, niche edits stretch a budget further without sacrificing much, provided the article match is genuinely relevant — see our [checklist for vetting any site](/resources/vet-guest-post-site-before-you-buy) before ordering either format.

Most effective campaigns don't pick one exclusively — they use guest posts to establish a handful of strong, well-framed placements on priority pages, then fill in supporting volume with niche edits on well-matched existing content.

## A Simple Rule of Thumb

Ask what the link needs to do. If it needs to anchor a new page with no existing coverage, write something new. If it needs to add incremental relevance to a page that already has some links, a well-matched niche edit is usually the more efficient spend. You can compare live pricing for both formats side by side on the [marketplace](/marketplace), or [talk to a strategist](/contact) if you'd rather have the split planned out for you.`,
  },

  {
    slug: "how-much-should-you-pay-for-a-guest-post",
    title: "How Much Should You Pay for a Guest Post in 2026? (Real Pricing Data)",
    category: "Guest Posting",
    excerpt:
      "Guest post prices range from under $50 to well over $1,000 for the same-sounding service. Here's what actually drives the price, using real listing data.",
    author: "Daniel Okoye",
    readingMinutes: 13,
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
      {
        question: "Does price correlate with how long a guest post takes to deliver?",
        answer:
          "Not directly. Higher-priced sites sometimes have longer editorial queues because of higher submission volume, while some mid-priced sites turn placements around faster simply because they publish more frequently.",
      },
    ]),
    body: `Ask five people what a guest post should cost and you'll get five different numbers, and all of them might be right — for the specific site they had in mind. Pricing in this market isn't arbitrary, but it also isn't standardised, which makes it easy for a buyer to either overpay for a low-value site or underpay expectations for a genuinely strong one.

Here's what actually moves the number, based on the pricing patterns across thousands of active listings on our [guest post marketplace](/marketplace).

## The Core Drivers of Guest Post Pricing

### Domain Authority and Domain Rating

These remain the most visible inputs, and sellers price around them because buyers ask about them first. But authority alone doesn't set price — it sets a rough tier that traffic and niche then adjust up or down. Our guide to [vetting a site before you buy](/resources/vet-guest-post-site-before-you-buy) explains why the number alone isn't the full picture.

### Organic Traffic

Two sites with identical DA can have wildly different traffic, and traffic tends to matter more to price than the authority score itself. A site pulling in tens of thousands of monthly visits justifies a higher price than a similarly-scored site getting a few hundred.

### Niche and Commercial Intent

Finance, legal, SaaS and health sites typically command higher prices than general lifestyle or hobby blogs at the same authority level, because advertisers in those niches have historically paid more for placements — the guest post market reflects that broader ad-value pattern.

### Link Type

Dofollow links generally cost more than nofollow, since they pass a stronger authority signal. Some publishers only offer nofollow due to their own editorial policy, which typically shows up as a lower price for the placement.

### Content Requirements

If the price includes the publisher (or seller) writing the article, expect a premium over a listing where you supply your own draft. Word count minimums and topic restrictions can also affect price, and some publishers charge extra for expedited turnaround if you need a placement live faster than their normal editorial queue would allow.

## Typical Price Ranges by Site Tier

| Site Tier | Typical DA Range | Typical Monthly Traffic | Typical Price |
|---|---|---|---|
| Small niche blog | 15–35 | Under 5,000 | $30–$100 |
| Established niche site | 30–55 | 5,000–50,000 | $80–$250 |
| Strong industry publication | 50–70 | 50,000–250,000 | $200–$600 |
| Major outlet / high-traffic site | 70+ | 250,000+ | $500–$2,000+ |

These ranges overlap deliberately — a small niche site in a high-value vertical like finance can out-price a larger general-interest site, and a big outlet with declining relevance can sometimes be found cheaper than its authority score implies.

## Real Listing Patterns Across Price Tiers

Browsing a large, price-listed marketplace makes the pattern easier to see than any single average number. At the lower end, a niche hobby or local-interest site with a few thousand monthly visitors commonly lists in the $30–$70 range — reasonable for a supporting link on a page that doesn't need a flagship placement. In the middle tier, an established site with a genuine, specific audience — a regional business publication, a well-run SaaS review blog — tends to sit in the $150–$300 range, reflecting both its traffic and the narrower, more valuable audience it reaches. At the top, sites with six-figure monthly traffic and strong topical authority justify $500 and up, often because the referral traffic alone would cost more to replicate through paid channels.

## How Seasonal Demand Affects Pricing

Guest post pricing isn't static throughout the year. Demand tends to rise ahead of major shopping periods as e-commerce and retail-adjacent businesses push harder for visibility, and again early in the calendar year as companies deploy annual marketing budgets. Publishers with limited editorial capacity sometimes raise prices or extend turnaround times during these windows simply because submission volume increases. If your campaign timeline is flexible, ordering slightly outside these peak periods can mean faster turnaround at a similar price.

## Negotiating Bulk Rates: What's Realistic

Individual marketplace listings are usually fixed-price — the seller has already priced the placement against that domain's metrics, and there's limited room to negotiate a single order. Where negotiation is more realistic is volume: ordering five, ten, or more placements from the same seller, or committing to a recurring monthly volume, often opens the door to a modest per-link discount, typically in the 10–20% range. It's reasonable to ask; it's not reasonable to expect a steep discount on a single one-off order from a site with genuinely strong metrics.

## How Payment Method Affects Price and Trust

Most marketplace transactions run through standard payment processors, which gives buyers a layer of dispute protection that direct bank transfers to an individual seller don't. Sellers accepting only untraceable payment methods for a first-time order are worth extra caution regardless of how attractive the listed price looks — reputable marketplaces and agencies use payment methods that leave both parties with a paper trail and some recourse if a placement doesn't materialise as described. This matters more than it might seem, since a placement dispute with no payment trail generally leaves the buyer with little recourse beyond simply not ordering from that seller again.

## Regional Pricing Differences Worth Knowing

Guest post pricing also varies by the primary market a site serves. Publications with a US or UK audience, particularly in commercially competitive niches, tend to price at the higher end of their tier compared to similarly-sized sites serving other regions, largely reflecting differences in average advertiser spend across those markets. This isn't a rule to game — a genuinely relevant site in a lower-cost region can still be an excellent buy — but it explains part of why two sites with near-identical DA and traffic numbers sometimes carry noticeably different price tags.

## A Simple Framework for Setting Your Own Ceiling

Rather than asking "is this price fair in general," a more useful question is "what would I pay to reach this specific audience through any channel." If a site's estimated monthly traffic in your niche would cost a comparable amount to reach through paid advertising, the guest post price starts to look reasonable by comparison — with the added benefit that the placement keeps working indefinitely rather than stopping the moment an ad budget runs out. This framing tends to produce more consistent decisions than comparing raw DA numbers across unrelated niches.

## What Happens When You Overpay (and How to Avoid It)

Overpaying for a guest post rarely means losing money outright — you still get a real placement, most of the time. What you lose is efficiency: the same budget could have bought two or three placements on equally relevant, slightly lower-tier sites instead of one on a premium site, and for most link building goals, several relevant links outperform one, particularly earlier in a campaign when a page has few or no backlinks yet. Before paying a premium price, it's worth checking whether that budget would go further split across a couple of solid mid-tier sites — a comparison our [marketplace](/marketplace) makes easy since every listing shows price alongside authority and traffic.

## Tracking Price Trends Over Time

Because guest post pricing isn't centrally set, it drifts gradually as publisher traffic changes, as niches become more or less commercially competitive, and as the overall supply of sellers in a space shifts. A site that was reasonably priced a year ago might now be under- or over-priced relative to its current traffic, which is one more reason a snapshot DA number matters less than checking current, live metrics before every order rather than relying on a price you remember from a previous campaign. Buyers who track pricing across a handful of go-to niches over time tend to develop a much sharper sense of what's a genuinely good deal versus an inflated one than any general pricing guide, including this one, can offer on its own.

## Why Transparent, Live-Priced Marketplaces Change the Calculation

A meaningful share of the historical confusion around guest post pricing came from opacity — buyers paying an agency a flat rate per link with no visibility into what the agency itself paid the publisher, or what the site's actual metrics were at the time. A marketplace model where every listing shows its own authority, traffic and price side by side removes most of that guesswork, since you're comparing real, current numbers rather than trusting a middleman's summary. It doesn't eliminate the need for judgment — you still have to decide which metrics matter most for your specific page — but it means the judgment is based on visible data rather than a quoted number you have no way to verify independently.

## Putting a Number on Your Own Campaign

Rather than asking "what does a guest post cost" in the abstract, the more useful exercise is pricing out your own specific campaign: list the pages you want to support, decide roughly how many links each needs, and set a per-tier budget using the ranges in this guide as a starting point. A page competing for a genuinely difficult keyword usually justifies leaning toward the higher end of the "established niche" or "strong industry publication" tiers, while a lower-priority supporting page can be served well by smaller, cheaper sites. Doing this exercise once, in writing, before you start browsing listings tends to produce better spending decisions than reacting to individual site prices as you come across them.

## Where to Go From Here

Once you have a rough budget and tier in mind, the fastest way to see how far it goes is to look at live listings rather than estimates — real prices shift week to week as publisher traffic and demand change. Our [marketplace](/marketplace) shows current authority, traffic and price together for every listed site, so you can check your budget against what's actually available today rather than planning around numbers that may already be out of date by the time you're ready to order. And if a page's needs turn out to be more about speed and volume than a handful of flagship placements, it's worth reading through the [guest post versus niche edit comparison](/resources/guest-posting-vs-niche-edits) before finalising how that budget gets split.

## When a Price Looks Too Good

A guest post at $15–$20 on a site claiming DA 50+ and six-figure traffic is worth extra scrutiny before ordering. Check the traffic distribution and recent post engagement rather than assuming the price alone confirms or denies the site's value — some listings are simply underpriced by a seller who hasn't updated rates, and some are inflated metrics on a thin site.

## What You're Really Paying For

Beyond the number itself, a guest post price is buying three things: the audience the domain has already built, the trust search engines have already assigned it, and the editorial process that makes the placement look — and function — like a genuine recommendation rather than a paid insert.

When comparing two similarly priced sites, the tie-breaker is usually relevance: the site closer to your actual industry, even at a slightly lower traffic number, tends to be the better buy — a trade-off we cover in more depth in [guest posting vs. niche edits](/resources/guest-posting-vs-niche-edits).

## A Practical Budgeting Approach

Rather than setting a flat per-link budget, decide what tier of site actually matters for the page you're building links to. A competitive commercial page usually justifies at least a few placements from the "established niche" or "strong industry publication" tiers. A lower-priority supporting page can often be served well by smaller, cheaper, but still genuinely relevant sites. You can [browse live listings by price and authority](/marketplace) to see exactly where your budget lands today.`,
  },

  {
    slug: "do-guest-posts-still-work-for-seo",
    title: "Do Guest Posts Still Work for SEO in 2026?",
    category: "Link Building",
    excerpt:
      "Guest posting has been declared 'dead' every year for over a decade. Here's what actually changed, what didn't, and how to tell if a placement is still worth doing.",
    author: "Marta Ellison",
    readingMinutes: 12,
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
      {
        question: "How long does it take to see results from guest posting?",
        answer:
          "Most sites see initial movement within 6–12 weeks of a placement going live and getting indexed, though competitive keywords and newer sites often take longer for the full effect to show up in rankings.",
      },
    ]),
    body: `Every year brings a fresh round of "guest posting is dead" posts, and every year, sites keep getting genuine editorial placements and keep seeing them contribute to rankings. Both things can be true at once, because "guest posting" describes two very different practices that happen to share a name.

## The Version That Stopped Working

Somewhere in the last decade, guest posting scaled into an industry of its own — networks of thin sites built specifically to host sponsored articles, syndicated across dozens of near-identical domains, stuffed with exact-match anchor text, and sold in bulk packages priced by volume rather than relevance.

Search engines caught up to this pattern. Sites in these networks lost authority, got deindexed, or simply stopped passing meaningful value, and the links pointing from them followed. If your mental model of "guest posting" is this version, it's fair to say it stopped working — because it did.

## The Version That Still Works

A genuinely different practice runs alongside it: pitching a real, relevant publication with a real audience, writing something that publication's editors would accept even without a link attached, and getting it published through the same editorial process any other contributor goes through.

This version hasn't stopped working because it was never a scheme to begin with — it's closer to what digital PR and content marketing teams call "earned media," except you're doing some of the earning by writing the piece yourself rather than waiting for a journalist to notice you. Our [guide to vetting guest post sites](/resources/vet-guest-post-site-before-you-buy) is built specifically to help you tell these two versions apart before you order.

## What Actually Changed

### The Bar for "Relevant" Got Higher

A tenuous keyword connection used to be enough to justify a placement. Now, the site's overall topical focus and the specific article's context both need to make sense together, or the placement contributes little beyond a passing mention.

### Anchor Text Patterns Get More Scrutiny

Heavy use of exact-match commercial anchors ("best accounting software" linked from every guest post) reads as manipulation more clearly today than it once did. Natural, varied anchor text — including branded and generic phrases — better reflects how real writers actually link.

### Site-Level Signals Matter More Than Individual Links

A single strong placement on a thin, low-quality domain contributes less than the same placement would on a site with a genuine editorial history, because search engines increasingly evaluate the linking site's overall trustworthiness, not just the presence of a link. This is part of why the checklist approach — looking at the whole site, not just one article — matters more now than a narrower focus on the specific page a link will sit on.

## What Google Has Actually Said About Guest Posting

Google's own guidance has been consistent for years: guest posting is fine as a way to reach an audience and share expertise, but guest posts written primarily to build links, especially at scale with keyword-rich anchor text, fall under link scheme guidance the same as any other artificial link-building pattern. The distinction Google draws isn't about the format — it's about intent and execution. A single well-written article on a relevant site, published because an editor thought their readers would benefit, sits entirely outside that guidance. A templated article distributed to fifty loosely related sites with identical anchor text does not.

## Case Pattern: Recovering From a Bad Link Building Phase

A common pattern we see: a site accumulated a batch of low-quality guest post links years ago — network sites, unrelated niches, aggressive exact-match anchors — and rankings have been flat or declining since. Recovery in these cases usually isn't about undoing the old links one by one; disavowing the worst offenders removes some drag, but the bigger lever is building a new layer of genuinely relevant, editorially placed links on top. Search engines re-evaluate a site's overall link profile over time, and a site that shifts from mostly low-quality links to a growing share of high-relevance ones tends to see the trend reverse gradually, not overnight.

## How to Tell if a Placement Is Worth Doing

Run through these questions before ordering:

- Would this article make sense on this site even if my link weren't in it?
- Does the site have other content in this general topic area?
- Is the anchor text natural in context, or does it read as inserted?
- Would a real reader of this site plausibly click through to my page?

If the honest answer to most of these is yes, the placement belongs to the version of guest posting that still works.

## Building a Sustainable Guest Posting Cadence

Rather than a single burst of placements, a steadier cadence — a handful of genuinely good links each month rather than fifty in one week — tends to read more naturally to search engines and is easier to sustain from a budget and quality-control standpoint. It also gives you room to adjust: if a batch of placements doesn't perform as expected, a slower cadence means you've committed less budget before noticing and can course-correct. Many established sites settle into a rhythm of three to six placements per month once a campaign matures past its initial phase, adjusting up or down based on how competitive their target keywords turn out to be.

## Why Volume Alone Never Really Worked, Even Before Search Engines Caught Up

It's worth separating two different claims: "bulk low-quality guest posting no longer works" and "it never worked in the first place." The evidence points more toward the second. Even in the earlier years of aggressive guest post networks, the sites that saw the most durable gains weren't the ones buying the most links — they were the ones getting a smaller number of placements on genuinely relevant, reasonably trafficked sites. What changed is that the gap between the two approaches widened, and got easier for search engines to detect. The underlying principle — real relevance beats artificial volume — was true even when enforcement was weaker.

## How to Audit Your Own Existing Guest Post Links

If you've been building links for a while and aren't sure how much of your existing profile falls into the "still works" category versus the "stopped working" category, a basic audit covers:

1. **Pull your full backlink list** from any major SEO tool that tracks your site's inbound links.
2. **Sort by referring domain** and spot-check the ones you don't immediately recognise — visit the page the link sits on and ask whether it reads as a genuine article or a thin sponsored insert.
3. **Flag domains with clear red flags** — sites with a burst of unrelated sponsored content, no real bylines, or traffic concentrated in a way that doesn't match a real audience.
4. **Decide case by case** whether flagged links are worth disavowing, or simply left alone if they're not causing active harm — a large volume of very old, weak links is usually lower priority than a smaller number of clearly manipulative recent ones.

This kind of audit is also useful before starting a new campaign, since it tells you what your existing profile actually looks like rather than assuming.

## What a Healthy Link Profile Looks Like Today

A link profile that holds up well tends to show variety — different domains, different niches adjacent to your own, a mix of guest posts, mentions, and naturally earned links, with anchor text that varies rather than repeating the same commercial phrase. It also tends to grow gradually rather than in sudden spikes, which is one more reason a steady monthly cadence outperforms an aggressive short burst, even when the total number of links ends up similar.

## Why This Debate Keeps Resurfacing Every Year

Part of the reason "guest posting is dead" resurfaces annually is that the low-quality version genuinely does keep getting built, and genuinely does keep failing, giving each new cohort of marketers a fresh example to point to. Meanwhile, the sites quietly getting real value from genuine editorial placements rarely write blog posts about it, since there's no compelling headline in "we got a relevant link on a good site and it modestly helped." The visible failures are louder than the quiet successes, which skews the public conversation more pessimistic than the underlying reality warrants. That asymmetry is worth keeping in mind any time a sweeping claim about an entire tactic being "dead" starts circulating — the claim is usually true of one version of the tactic and false of another, and the interesting work is figuring out which version you're actually looking at.

## What This Means for Your Own Campaign Decisions

None of this is an argument for guest posting at any cost or in any volume — it's an argument for being specific about which version of the practice you're actually running. Before greenlighting a campaign, it's worth asking whether the plan would survive being described honestly to the publisher's own editorial team: "we'd like to place a link on your site because it's relevant to your readers" describes the version that still works; "we'd like to place fifty links across fifty similar sites this month with the same anchor text" describes the version that doesn't. Most buyers already know intuitively which description fits their plan — the checklist in this guide is mainly there to make that intuition explicit before money changes hands, so a campaign gets evaluated on the same terms search engines are likely to apply, rather than on hope that volume alone will carry it.

## A Closing Thought on Durability

Links built the way this guide describes tend to age well, in the sense that they don't need constant defending or monitoring for penalty risk the way aggressive, low-quality link building often does. A genuinely relevant placement on a real publication is simply a normal part of that site's content — it doesn't become more suspicious over time the way a network link does as search engines get better at pattern detection. That durability is, in the end, the real argument for doing guest posting the slower, more selective way: not just that it works better today, but that it doesn't come with an expiration date attached. When you're ready to find placements that meet this bar, [browse real, vetted listings](/marketplace) rather than starting from a cold outreach list, or read our full [pricing breakdown](/resources/how-much-should-you-pay-for-a-guest-post) to plan a budget that matches the quality you're aiming for.

## A Quick Comparison

| Signal | Still Works | Stopped Working |
|---|---|---|
| Site has real, varied content | Yes | Mostly sponsored posts only |
| Anchor text | Natural, varied | Exact-match, repetitive |
| Topical fit | Genuine overlap | Loose or forced connection |
| Publishing pattern | Steady over time | Sudden bulk publishing |
| Audience | Real, even if small | None beyond link buyers |

## The Bottom Line

Guest posting as a category didn't stop working — the low-effort, high-volume version of it did, and that's the version most "guest posting is dead" arguments are actually describing. Editorial placements on genuine, relevant publications remain one of the more durable ways to build both authority and real audience exposure, provided each one is chosen the way you'd choose where to submit an article if links weren't part of the equation at all. When you're ready to find sites that meet that bar, our [marketplace](/marketplace) lists real, price-checked publishers with authority and traffic shown upfront — or [reach out](/contact) if you'd like a strategist to build the shortlist for you.`,
  },
];
