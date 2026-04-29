import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import * as v from "valibot";
import { StrategyArticle } from "~/components/strategy-article";
import { strategyContent } from "~/content/strategies.server";

export const getStrategyArticle = createServerFn({ method: "GET" })
  .inputValidator(v.object({ title: v.string(), slug: v.string() }))
  .handler(async ({ data }) => {
    const markdown = strategyContent[data.slug] ?? "Content coming soon.";

    const Renderable = await renderServerComponent(
      <StrategyArticle title={data.title} markdown={markdown} />,
    );

    return { Renderable };
  });
