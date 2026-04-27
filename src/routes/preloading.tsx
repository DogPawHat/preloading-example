import { Suspense } from "react";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import * as v from "valibot";
import { QueryTrace } from "~/components/console/query-trace";
import {
  formatPokemonListQueryKey,
  getCacheStatus,
  getFetchStatus,
  getLoadingCacheStatus,
  getLoadingFetchStatus,
  getLoadingPreloadStatus,
  getPreloadStatus,
} from "~/components/console/query-trace-utils";
import { PaginationNav } from "~/components/pagination-nav";
import { ConsoleCard } from "~/components/console/console-card";
import { SectionHeader } from "~/components/console/section-header";
import { PokemonTableSkeleton } from "~/components/console/pokemon-table-skeleton";
import { POKEMON_LIMIT } from "~/constants";
import { getPokemonListQueryKey, getPokemonListQueryFn } from "~/util/pokemon";
import { lazily } from "~/util/lazily";

const { PokemonTable } = lazily(() => import("~/components/console/pokemon-table"));

const searchParamsSchema = v.object({
  offset: v.optional(v.number(), 0),
});

const getPreloadingQueryTraceProps = (currentOffset: number) => ({
  behaviorDescription:
    "Route-level preload: the loader starts the Pokémon query before this route renders, so the table can use cached data on arrival.",
  queryKeys: [formatPokemonListQueryKey("preloading", currentOffset)],
  strategyDescription: "loader prefetchQuery",
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
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(context.pokemonListOptions);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { offset: currentOffset } = Route.useSearch();

  return (
    <main className="min-h-screen bg-(--bg-primary) p-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader title="02_preloading" subtitle="// Route-level prefetch" />

        <ConsoleCard className="mb-6">
          <h1 className="text-lg font-mono text-(--text-primary) mb-4">
            National Pokédex: Pokémon {currentOffset + 1}-{currentOffset + POKEMON_LIMIT}
          </h1>
          <Suspense
            fallback={
              <>
                <div className="min-h-125">
                  <QueryTrace
                    {...getPreloadingQueryTraceProps(currentOffset)}
                    cacheStatus={getLoadingCacheStatus()}
                    fetchStatus={getLoadingFetchStatus()}
                    preloadStatus={getLoadingPreloadStatus()}
                  />
                  <PokemonTableSkeleton rowCount={POKEMON_LIMIT} />
                </div>
                <PaginationNav prevOffset={null} nextOffset={null} to="/preloading" />
              </>
            }
          >
            <PokemonTableContent currentOffset={currentOffset} />
          </Suspense>
        </ConsoleCard>
      </div>
    </main>
  );
}

function PokemonTableContent({ currentOffset }: { currentOffset: number }) {
  const { pokemonListOptions } = useRouteContext({ from: "/preloading" });
  const { data, dataUpdatedAt, fetchStatus, status } = useSuspenseQuery(pokemonListOptions);

  return (
    <>
      <div className="min-h-125">
        <QueryTrace
          {...getPreloadingQueryTraceProps(currentOffset)}
          cacheStatus={getCacheStatus(dataUpdatedAt)}
          fetchStatus={getFetchStatus(fetchStatus, status)}
          preloadStatus={getPreloadStatus(dataUpdatedAt)}
        />
        <PokemonTable pokemon={data.pokemon} />
      </div>
      <PaginationNav prevOffset={data.prevOffset} nextOffset={data.nextOffset} to="/preloading" />
    </>
  );
}
