import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import * as v from "valibot";
import { StrategyChapterLayout } from "~/components/strategy-page-layout";
import { ConsoleCard } from "~/components/console/console-card";
import {
  PokedexPagination,
  PokedexTableResults,
  PokedexTableSection,
} from "~/components/tables/pokedex-table-section";
import { getPokemonListQueryFn, getPokemonListQueryKey } from "~/utils/pokemon";
import { getStrategyArticle } from "~/server/strategy-article.functions";

const searchParamsSchema = v.object({
  offset: v.optional(v.number(), 0),
});

export const Route = createFileRoute("/basic")({
  validateSearch: searchParamsSchema,
  loader: async () => {
    const { Renderable: Article } = await getStrategyArticle({
      data: { title: "No prefetching", slug: "basic" },
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
      headerTitle="01_basic"
      headerSubtitle="// No prefetching (baseline)"
      sidebar={Article}
    >
      <ConsoleCard className="mb-6">
        <PokedexTableSection
          currentOffset={currentOffset}
          fallbackPagination={<PokedexPagination prevOffset={null} nextOffset={null} to="/basic" />}
        >
          <PokemonTableContent currentOffset={currentOffset} />
        </PokedexTableSection>
      </ConsoleCard>
    </StrategyChapterLayout>
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
