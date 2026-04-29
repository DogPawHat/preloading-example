import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import * as v from "valibot";
import { StrategyChapterLayout } from "~/components/strategy-page-layout";
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

export const Route = createFileRoute("/intent-preloading")({
  validateSearch: searchParamsSchema,
  loaderDeps: ({ search }) => ({
    offset: search.offset,
  }),
  context: ({ deps }) => {
    const newKey = getPokemonListQueryKey("intent-preloading", deps.offset);

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
      data: { title: "Hover and focus preloading", slug: "intent-preloading" },
    });
    return { Article };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { offset: currentOffset } = Route.useSearch();
  const { Article } = Route.useLoaderData();

  return (
    <StrategyChapterLayout
      headerTitle="03_intent-preloading"
      headerSubtitle="// Hover-based prefetch"
      sidebar={Article}
    >
      <ConsoleCard className="mb-6">
        <PokedexTableSection
          currentOffset={currentOffset}
          fallbackPagination={
            <PokedexPagination prevOffset={null} nextOffset={null} to="/intent-preloading" />
          }
        >
          <PokemonTableContent />
        </PokedexTableSection>
      </ConsoleCard>
    </StrategyChapterLayout>
  );
}

function PokemonTableContent() {
  const { pokemonListOptions } = useRouteContext({ from: "/intent-preloading" });
  const { data } = useSuspenseQuery(pokemonListOptions);

  return (
    <PokedexTableResults
      pokemon={data.pokemon}
      pagination={
        <PokedexPagination
          prefetch="intent"
          prevOffset={data.prevOffset}
          nextOffset={data.nextOffset}
          to="/intent-preloading"
        />
      }
    />
  );
}
