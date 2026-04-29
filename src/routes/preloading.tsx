import { Suspense } from "react";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import * as v from "valibot";
import { PaginationNav } from "~/components/pagination-nav";
import { StrategyPageLayout } from "~/components/strategy-page-layout";
import { ConsoleCard } from "~/components/console/console-card";
import { SectionHeader } from "~/components/console/section-header";
import { PokemonTableSkeleton } from "~/components/tables/pokemon-table-skeleton";
import { POKEMON_LIMIT } from "~/constants";
import { getPokemonListQueryKey, getPokemonListQueryFn } from "~/utils/pokemon";
import { lazily } from "~/lib/lazily";
import { getStrategyArticle } from "~/server/strategy-article.functions";

const { PokemonTable } = lazily(() => import("~/components/tables/pokemon-table"));

const searchParamsSchema = v.object({
  offset: v.optional(v.number(), 0),
});

export const Route = createFileRoute("/preloading")({
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
    <main className="min-h-screen bg-(--bg-primary) p-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="02_preloading" subtitle="// Route-level prefetch" />

        <StrategyPageLayout sidebar={Article}>
          <ConsoleCard className="mb-6">
            <h1 className="text-lg font-mono text-(--text-primary) mb-4">
              National Pokédex: Pokémon {currentOffset + 1}-{currentOffset + POKEMON_LIMIT}
            </h1>
            <Suspense
              fallback={
                <>
                  <div className="min-h-125">
                    <PokemonTableSkeleton rowCount={POKEMON_LIMIT} />
                  </div>
                  <PaginationNav prevOffset={null} nextOffset={null} to="/preloading" />
                </>
              }
            >
              <PokemonTableContent />
            </Suspense>
          </ConsoleCard>
        </StrategyPageLayout>
      </div>
    </main>
  );
}

function PokemonTableContent() {
  const { pokemonListOptions } = useRouteContext({ from: "/preloading" });
  const { data } = useSuspenseQuery(pokemonListOptions);

  return (
    <>
      <div className="min-h-125">
        <PokemonTable pokemon={data.pokemon} />
      </div>
      <PaginationNav prevOffset={data.prevOffset} nextOffset={data.nextOffset} to="/preloading" />
    </>
  );
}
