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

export const BLOG_POSTS = [
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
