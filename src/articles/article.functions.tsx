import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import * as v from "valibot";

import { ArticleShell } from "~/articles/article-shell.server";

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

const ArticleSlugSchema = v.picklist(articleSlugs);
type ArticleSlug = v.InferInput<typeof ArticleSlugSchema>;

const articlesContent: Record<ArticleSlug, () => Promise<string>> = {
  basic: () => import("./content/basic.md?raw").then((m) => m.default),
  preloading: () => import("./content/preloading.md?raw").then((m) => m.default),
  "intent-preloading": () => import("./content/intent-preloading.md?raw").then((m) => m.default),
  pagination: () => import("./content/pagination.md?raw").then((m) => m.default),
  filters: () => import("./content/filters.md?raw").then((m) => m.default),
  "debounced-preload-filters": () =>
    import("./content/debounced-preload-filters.md?raw").then((m) => m.default),
  "live-query": () => import("./content/live-query.md?raw").then((m) => m.default),
  "live-query-filters": () => import("./content/live-query-filters.md?raw").then((m) => m.default),
};

const getServerArticle = createServerFn({ method: "GET" })
  .middleware([staticFunctionMiddleware])
  .inputValidator(v.object({ slug: ArticleSlugSchema }))
  .handler(async ({ data }) => {
    const markdown = await (articlesContent[data.slug]?.() ??
      Promise.resolve("Content coming soon."));

    const article = await renderServerComponent(<ArticleShell markdown={markdown} />);

    return { article };
  });

export const getArticleQueryOptions = ({ slug }: { slug: ArticleSlug }) =>
  queryOptions({
    queryKey: ["article", { slug }],
    structuralSharing: false,
    staleTime: Infinity,
    queryFn: () => getServerArticle({ data: { slug } }),
  });
