import { NextResponse } from "next/server";
import { BLOG_POSTS, BLOG_POST_WORD_COUNTS } from "@/db/blog-posts";

export const dynamic = "force-dynamic";

export function GET() {
  const slugs = BLOG_POSTS.map((post) => post.slug);
  const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index);
  const under2000 = BLOG_POST_WORD_COUNTS.filter((post) => post.words < 2000);

  return NextResponse.json({
    total: BLOG_POSTS.length,
    duplicateSlugs: [...new Set(duplicateSlugs)],
    under2000,
    posts: BLOG_POST_WORD_COUNTS,
  });
}
