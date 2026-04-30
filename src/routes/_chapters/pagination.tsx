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

    const paginationArticleQueryOptions = getArticleQueryOptions({
      title: "Viewport pagination preload",
      slug: "pagination",
    });

    return {
      pokemonListOptions,
      paginationArticleQueryOptions,
    };
  },
  loader: async ({
    context: { queryClient, pokemonListOptions, paginationArticleQueryOptions },
  }) => {
    void queryClient.prefetchQuery(pokemonListOptions);
    await queryClient.ensureQueryData(paginationArticleQueryOptions);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { offset: currentOffset } = Route.useSearch();
  const { paginationArticleQueryOptions } = Route.useRouteContext();

  const {
    data: { article },
  } = useSuspenseQuery(paginationArticleQueryOptions);

  return (
    <ChapterSplitColumn
      blog={article}
      table={
        <DemoCard className="mb-6">
          <PokedexTableSection
            currentOffset={currentOffset}
            fallbackPagination={
              <PokedexPagination prevOffset={null} nextOffset={null} to="/pagination" />
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
