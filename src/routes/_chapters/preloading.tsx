import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import * as v from "valibot";
import { BlogTableSplitColumn } from "~/components/blog-table-split-column";
import { ConsoleCard } from "~/components/console/console-card";
import {
  PokedexPagination,
  PokedexTableResults,
  PokedexTableSection,
} from "~/components/tables/pokedex-table-section";
import { getPokemonListQueryKey, getPokemonListQueryFn } from "~/utils/pokemon";
import { getStrategyArticle } from "~/server/strategy-article.functions";

const searchParamsSchema = v.object({
  offset: v.optional(v.number(), 0),
});

export const Route = createFileRoute("/_chapters/preloading")({
  staticData: {
    routeTitle: "02_preloading",
    routeSubtitle: "// Route-level prefetch",
  },
  validateSearch: searchParamsSchema,
  loaderDeps: ({ search }) => ({
    offset: search.offset,
  }),
  context: ({ deps }) => {
    const newKey = getPokemonListQueryKey("preloading", deps.offset);

    const pokemonListOptions = queryOptions({
      queryKey: newKey,
      queryFn: getPokemonListQueryFn,
    });

    return {
      pokemonListOptions,
    };
  },
  loader: async ({ context }) => {
    void context.queryClient.prefetchQuery(context.pokemonListOptions);
    const { Renderable: Article } = await getStrategyArticle({
      data: { title: "Route-level prefetch", slug: "preloading" },
    });
    return { Article };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { offset: currentOffset } = Route.useSearch();
  const { Article } = Route.useLoaderData();

  return (
    <BlogTableSplitColumn
      blog={Article}
      table={
        <ConsoleCard className="mb-6">
          <PokedexTableSection
            currentOffset={currentOffset}
            fallbackPagination={
              <PokedexPagination prevOffset={null} nextOffset={null} to="/preloading" />
            }
          >
            <PokemonTableContent />
          </PokedexTableSection>
        </ConsoleCard>
      }
    />
  );
}

function PokemonTableContent() {
  const { pokemonListOptions } = useRouteContext({ from: "/_chapters/preloading" });
  const { data } = useSuspenseQuery(pokemonListOptions);

  return (
    <PokedexTableResults
      pokemon={data.pokemon}
      pagination={
        <PokedexPagination
          prevOffset={data.prevOffset}
          nextOffset={data.nextOffset}
          to="/preloading"
        />
      }
    />
  );
}
