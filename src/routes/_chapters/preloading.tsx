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

    const preloadingArticleQueryOptions = getArticleQueryOptions({
      slug: "preloading",
    });

    return {
      pokemonListOptions,
      preloadingArticleQueryOptions,
    };
  },
  loader: async ({
    context: { queryClient, pokemonListOptions, preloadingArticleQueryOptions },
  }) => {
    void queryClient.prefetchQuery(pokemonListOptions);
    await queryClient.ensureQueryData(preloadingArticleQueryOptions);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { offset: currentOffset } = Route.useSearch();
  const { preloadingArticleQueryOptions } = Route.useRouteContext();

  const {
    data: { article },
  } = useSuspenseQuery(preloadingArticleQueryOptions);

  return (
    <ChapterSplitColumn
      blog={article}
      table={
        <DemoCard className="mb-6">
          <PokedexTableSection
            currentOffset={currentOffset}
            fallbackPagination={
              <PokedexPagination prevOffset={null} nextOffset={null} to="/preloading" />
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
