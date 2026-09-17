import { BLOG_POSTS as CORE_BLOG_POSTS } from "@/db/blog-posts-core";
import { BLOG_POSTS_BATCH_01 } from "@/db/blog-posts-batch-01";
import { BLOG_POSTS_BATCH_02 } from "@/db/blog-posts-batch-02";
import { BLOG_POSTS_BATCH_03 } from "@/db/blog-posts-batch-03";
import { BLOG_POSTS_BATCH_04 } from "@/db/blog-posts-batch-04";
import { BLOG_POSTS_BATCH_05 } from "@/db/blog-posts-batch-05";
import { BLOG_POSTS_BATCH_06 } from "@/db/blog-posts-batch-06";
import { BLOG_POSTS_BATCH_07 } from "@/db/blog-posts-batch-07";
import { BLOG_POSTS_BATCH_08 } from "@/db/blog-posts-batch-08";
import { BLOG_POSTS_BATCH_09 } from "@/db/blog-posts-batch-09";
import { BLOG_POSTS_BATCH_10 } from "@/db/blog-posts-batch-10";
import { BLOG_EXPANSIONS_01 } from "@/db/blog-expansions-01";
import { BLOG_EXPANSIONS_02 } from "@/db/blog-expansions-02";
import { BLOG_EXPANSIONS_03 } from "@/db/blog-expansions-03";
import { BLOG_EXPANSIONS_04 } from "@/db/blog-expansions-04";
import { BLOG_EXPANSIONS_05 } from "@/db/blog-expansions-05";

const ALL_BLOG_POSTS = [
  ...CORE_BLOG_POSTS,
  ...BLOG_POSTS_BATCH_01,
  ...BLOG_POSTS_BATCH_02,
  ...BLOG_POSTS_BATCH_03,
  ...BLOG_POSTS_BATCH_04,
  ...BLOG_POSTS_BATCH_05,
  ...BLOG_POSTS_BATCH_06,
  ...BLOG_POSTS_BATCH_07,
  ...BLOG_POSTS_BATCH_08,
  ...BLOG_POSTS_BATCH_09,
  ...BLOG_POSTS_BATCH_10,
];

const EXPANSIONS: Record<string, string> = {
  ...BLOG_EXPANSIONS_01,
  ...BLOG_EXPANSIONS_02,
  ...BLOG_EXPANSIONS_03,
  ...BLOG_EXPANSIONS_04,
  ...BLOG_EXPANSIONS_05,
};

function countWords(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!?(\[[^\]]*\])\([^)]*\)/g, "$1")
    .replace(/[#>*_|~`-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
}

export const BLOG_POSTS = ALL_BLOG_POSTS.map((post) => {
  const body = `${post.body ?? ""}${EXPANSIONS[post.slug] ?? ""}`.trim();
  const wordCount = countWords(body);

  return {
    ...post,
    author: "Linkslo Editorial Team",
    body,
    readingMinutes: Math.max(5, Math.ceil(wordCount / 220)),
  };
});

export const BLOG_POST_WORD_COUNTS = BLOG_POSTS.map((post) => ({
  slug: post.slug,
  words: countWords(post.body),
}));
