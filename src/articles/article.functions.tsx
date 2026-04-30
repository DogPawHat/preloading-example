import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import * as v from "valibot";
import { ArticleShell } from "~/articles/article-shell.server";

const articlesContent: Record<string, () => Promise<string>> = {
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

export const getArticle = createServerFn({ method: "GET" })
  .inputValidator(v.object({ title: v.string(), slug: v.string() }))
  .handler(async ({ data }) => {
    const markdown = await (articlesContent[data.slug]?.() ??
      Promise.resolve("Content coming soon."));

    const Renderable = await renderServerComponent(
      <ArticleShell title={data.title} markdown={markdown} />,
    );

    return { Renderable };
  });
