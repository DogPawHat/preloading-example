import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import * as v from "valibot";
import { BlogTableSplitColumn } from "~/chapters/chapter-split";
import { ConsoleCard } from "~/demos/components/console-card";
import {
  PokedexPagination,
  PokedexTableResults,
  PokedexTableSection,
} from "~/demos/components/pokedex-table-section";
import { getPokemonListQueryKey, getPokemonListQueryFn } from "~/demos/query/pokemon-query";
import { getStrategyArticle } from "~/articles/strategy-article.functions";

const searchParamsSchema = v.object({
  offset: v.optional(v.number(), 0),
});

export const Route = createFileRoute("/_chapters/pagination")({
  staticData: {
    routeTitle: "04_pagination",
    routeSubtitle: "// Preloading next/prev pages",
  },
  validateSearch: searchParamsSchema,
  loaderDeps: ({ search }) => ({
    offset: search.offset,
  }),
  context: ({ deps }) => {
    const newKey = getPokemonListQueryKey("pagination", deps.offset);

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
      data: { title: "Viewport pagination preload", slug: "pagination" },
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
              <PokedexPagination prevOffset={null} nextOffset={null} to="/pagination" />
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
  const { pokemonListOptions } = useRouteContext({ from: "/_chapters/pagination" });
  const { data } = useSuspenseQuery(pokemonListOptions);

  return (
    <PokedexTableResults
      pokemon={data.pokemon}
      pagination={
        <PokedexPagination
          prefetch="viewport"
          prevOffset={data.prevOffset}
          nextOffset={data.nextOffset}
          to="/pagination"
        />
      }
    />
  );
}
