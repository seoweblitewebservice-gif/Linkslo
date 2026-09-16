import { queryMarketplaceListings, type MarketplaceSortKey } from "@/lib/marketplace-query";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const params = new URL(request.url).searchParams;
    const result = await queryMarketplaceListings({
      q: params.get("q") ?? undefined,
      industry: params.get("industry") ?? undefined,
      country: params.get("country") ?? undefined,
      language: params.get("language") ?? undefined,
      linkType: params.get("linkType") ?? undefined,
      minAuthority: Number(params.get("minAuthority") ?? 0),
      minTraffic: Number(params.get("minTraffic") ?? 0),
      maxPrice: Number(params.get("maxPrice") ?? 0),
      sort: (params.get("sort") ?? "relevance") as MarketplaceSortKey,
      page: Number(params.get("page") ?? 1),
      pageSize: Number(params.get("pageSize") ?? 12),
    });
    return Response.json({ ok: true, ...result });
  } catch (error) {
    console.error("marketplace query failed", error);
    return Response.json({ ok: false, items: [], total: 0 }, { status: 500 });
  }
}
