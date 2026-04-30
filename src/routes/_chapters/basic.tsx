import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import * as v from "valibot";
import { DemoCard } from "~/demos/components/demo-card";
import {
  PokedexPagination,
  PokedexTableResults,
  PokedexTableSection,
} from "~/demos/components/pokedex-table-section";
import { getPokemonListQueryFn, getPokemonListQueryKey } from "~/demos/query/pokemon-query";
import { getArticleQueryOptions } from "~/articles/article.functions";
import { ChapterSplitColumn } from "~/chapters/chapter-split";

const searchParamsSchema = v.object({
  offset: v.optional(v.number(), 0),
});

export const Route = createFileRoute("/_chapters/basic")({
  staticData: {
    routeTitle: "01_basic",
    routeSubtitle: "// Baseline fetching",
  },
  context: () => {
    const noPrefetchArticleQueryOptions = getArticleQueryOptions({
      slug: "basic",
    });
    return { noPrefetchArticleQueryOptions };
  },
  validateSearch: searchParamsSchema,
  loader: async ({ context: { queryClient, noPrefetchArticleQueryOptions } }) => {
    await queryClient.ensureQueryData(noPrefetchArticleQueryOptions);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { offset: currentOffset } = Route.useSearch();
  const { noPrefetchArticleQueryOptions } = Route.useRouteContext();

  const {
    data: { article },
  } = useSuspenseQuery(noPrefetchArticleQueryOptions);

  return (
    <ChapterSplitColumn
      blog={article}
      table={
        <DemoCard className="mb-6">
          <PokedexTableSection
            currentOffset={currentOffset}
            fallbackPagination={
              <PokedexPagination prevOffset={null} nextOffset={null} to="/basic" />
            }
          >
            <PokemonTableContent currentOffset={currentOffset} />
          </PokedexTableSection>
        </DemoCard>
      }
    />
  );
}

function PokemonTableContent({ currentOffset }: { currentOffset: number }) {
  const queryKey = getPokemonListQueryKey("suspense", currentOffset);
  const { data } = useSuspenseQuery({
    queryKey,
    queryFn: getPokemonListQueryFn,
  });

  return (
    <PokedexTableResults
      pokemon={data.pokemon}
      pagination={
        <PokedexPagination prevOffset={data.prevOffset} nextOffset={data.nextOffset} to="/basic" />
      }
    />
  );
}
