import * as v from "valibot";

export const articleSlugs = [
  "basic",
  "preloading",
  "intent-preloading",
  "pagination",
  "filters",
  "debounced-preload-filters",
  "live-query",
  "live-query-filters",
] as const;

export const ArticleSlugSchema = v.picklist(articleSlugs);
export type ArticleSlug = v.InferInput<typeof ArticleSlugSchema>;
