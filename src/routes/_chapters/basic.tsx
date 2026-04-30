import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import * as v from "valibot";
import { ConsoleCard } from "~/demos/components/console-card";
import {
  PokedexPagination,
  PokedexTableResults,
  PokedexTableSection,
} from "~/demos/components/pokedex-table-section";
import { getPokemonListQueryFn, getPokemonListQueryKey } from "~/demos/query/pokemon-query";
import { getArticle } from "~/articles/article.functions";
import { ChapterSplitColumn } from "~/chapters/chapter-split";

const searchParamsSchema = v.object({
  offset: v.optional(v.number(), 0),
});

export const Route = createFileRoute("/_chapters/basic")({
  staticData: {
    routeTitle: "01_basic",
    routeSubtitle: "// Baseline fetching",
  },
  validateSearch: searchParamsSchema,
  loader: async () => {
    const { Renderable: Article } = await getArticle({
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
    <ChapterSplitColumn
      blog={Article}
      table={
        <ConsoleCard className="mb-6">
          <PokedexTableSection
            currentOffset={currentOffset}
            fallbackPagination={
              <PokedexPagination prevOffset={null} nextOffset={null} to="/basic" />
            }
          >
            <PokemonTableContent currentOffset={currentOffset} />
          </PokedexTableSection>
        </ConsoleCard>
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
