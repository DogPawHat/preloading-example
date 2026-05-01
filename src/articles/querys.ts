import { queryOptions } from "@tanstack/react-query";
import { getServerArticleStream } from "./__article.functions";
import type { ArticleSlug } from "./schemas";

export const getArticleQueryOptions = ({ slug }: { slug: ArticleSlug }) =>
  queryOptions({
    queryKey: ["article", { slug }] as const,
    structuralSharing: false,
    staleTime: Infinity,
    queryFn: async ({ queryKey }) => {
      const { Renderable } = await getServerArticleStream({ data: queryKey[1].slug });
      return { Article: Renderable };
    },
  });
