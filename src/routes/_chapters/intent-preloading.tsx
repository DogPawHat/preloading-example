import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import * as v from "valibot";
import { ChapterSplitColumn } from "~/chapters/chapter-split";
import { DemoCard } from "~/demos/components/demo-card";
import {
  PokedexPagination,
  PokedexTableResults,
  PokedexTableSection,
} from "~/demos/components/pokedex-table-section";
import { getPokemonListQueryKey, getPokemonListQueryFn } from "~/demos/query/pokemon-query";
import { getArticleQueryOptions } from "~/articles/article.functions";

const searchParamsSchema = v.object({
  offset: v.optional(v.number(), 0),
});

export const Route = createFileRoute("/_chapters/intent-preloading")({
  staticData: {
    routeTitle: "03_intent-preloading",
    routeSubtitle: "// Hover-based prefetch",
  },
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

    const intentArticleQueryOptions = getArticleQueryOptions({
      title: "Hover and focus preloading",
      slug: "intent-preloading",
    });

    return {
      pokemonListOptions,
      intentArticleQueryOptions,
    };
  },
  loader: async ({ context: { queryClient, pokemonListOptions, intentArticleQueryOptions } }) => {
    void queryClient.prefetchQuery(pokemonListOptions);
    await queryClient.ensureQueryData(intentArticleQueryOptions);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { offset: currentOffset } = Route.useSearch();
  const { intentArticleQueryOptions } = Route.useRouteContext();

  const {
    data: { article },
  } = useSuspenseQuery(intentArticleQueryOptions);

  return (
    <ChapterSplitColumn
      blog={article}
      table={
        <DemoCard className="mb-6">
          <PokedexTableSection
            currentOffset={currentOffset}
            fallbackPagination={
              <PokedexPagination prevOffset={null} nextOffset={null} to="/intent-preloading" />
            }
          >
            <PokemonTableContent />
          </PokedexTableSection>
        </DemoCard>
      }
    />
  );
}

function PokemonTableContent() {
  const { pokemonListOptions } = useRouteContext({ from: "/_chapters/intent-preloading" });
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
