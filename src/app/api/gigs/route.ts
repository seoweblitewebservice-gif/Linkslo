import { queryGigs, type GigSortKey } from "@/lib/gigs-query";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const result = await queryGigs({
      q: params.get("q") ?? undefined,
      category: params.get("category") ?? undefined,
      subcategory: params.get("subcategory") ?? undefined,
      industry: params.get("industry") ?? undefined,
      country: params.get("country") ?? undefined,
      language: params.get("language") ?? undefined,
      maxPrice: Number(params.get("maxPrice") ?? 0),
      maxDelivery: Number(params.get("maxDelivery") ?? 0),
      sort: (params.get("sort") ?? "recommended") as GigSortKey,
      page: Number(params.get("page") ?? 1),
      pageSize: Number(params.get("pageSize") ?? 24),
    });
    return Response.json({ ok: true, ...result });
  } catch (error) {
    console.error("backlink gig query failed", error);
    return Response.json({ ok: false, items: [], total: 0 }, { status: 500 });
  }
}
