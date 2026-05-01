import { createServerFn } from "@tanstack/react-start";
import { staticFunctionMiddleware } from "@tanstack/start-static-server-functions";
import { renderServerComponent } from "@tanstack/react-start/rsc";

import { ArticleSlugSchema, type ArticleSlug } from "./schemas";
import { ArticleShell } from "./__article-shell.server";

const articlesContent: Record<ArticleSlug, () => Promise<string>> = {
  basic: () => import("./__content/basic.md?raw").then((m) => m.default),
  preloading: () => import("./__content/preloading.md?raw").then((m) => m.default),
  "intent-preloading": () => import("./__content/intent-preloading.md?raw").then((m) => m.default),
  pagination: () => import("./__content/pagination.md?raw").then((m) => m.default),
  filters: () => import("./__content/filters.md?raw").then((m) => m.default),
  "debounced-preload-filters": () =>
    import("./__content/debounced-preload-filters.md?raw").then((m) => m.default),
  "live-query": () => import("./__content/live-query.md?raw").then((m) => m.default),
  "live-query-filters": () =>
    import("./__content/live-query-filters.md?raw").then((m) => m.default),
};

export const getServerArticleStream = createServerFn({ method: "GET" })
  .middleware([staticFunctionMiddleware])
  .inputValidator(ArticleSlugSchema)
  .handler(async ({ data: slug }) => {
    const getArticleContent = articlesContent[slug];
    const markdown = await getArticleContent();

    const Renderable = await renderServerComponent(<ArticleShell markdown={markdown} />);

    return { Renderable };
  });
