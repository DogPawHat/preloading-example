import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import * as v from "valibot";
import { QueryTrace } from "~/components/console/query-trace";
import {
  formatPokemonListQueryKey,
  getCacheStatus,
  getFetchStatus,
  getLoadingCacheStatus,
  getLoadingFetchStatus,
} from "~/components/console/query-trace-utils";
import { PaginationNav } from "~/components/pagination-nav";
import { ConsoleCard } from "~/components/console/console-card";
import { SectionHeader } from "~/components/console/section-header";
import { PokemonTableSkeleton } from "~/components/console/pokemon-table-skeleton";
import { POKEMON_LIMIT } from "~/constants";
import { getPokemonListQueryFn, getPokemonListQueryKey } from "~/util/pokemon";
import { lazily } from "~/util/lazily";

const { PokemonTable } = lazily(() => import("~/components/console/pokemon-table"));

const searchParamsSchema = v.object({
  offset: v.optional(v.number(), 0),
});

const getBasicQueryTraceProps = (currentOffset: number) => ({
  behaviorDescription:
    "No preload: the Pokémon query starts after this route renders. Until it resolves, the table shows its loading state.",
  queryKeys: [formatPokemonListQueryKey("suspense", currentOffset)],
  strategyDescription: "none",
});

export const Route = createFileRoute("/basic")({
  validateSearch: searchParamsSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { offset: currentOffset } = Route.useSearch();

  return (
    <main className="min-h-screen bg-(--bg-primary) p-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader title="01_basic" subtitle="// No prefetching (baseline)" />

        <ConsoleCard className="mb-6">
          <h1 className="text-lg font-mono text-(--text-primary) mb-4">
            National Pokédex: Pokémon {currentOffset + 1}-{currentOffset + POKEMON_LIMIT}
          </h1>
          <Suspense
            fallback={
              <>
                <PokemonTableShell>
                  <QueryTrace
                    {...getBasicQueryTraceProps(currentOffset)}
                    cacheStatus={getLoadingCacheStatus()}
                    fetchStatus={getLoadingFetchStatus()}
                  />
                  <PokemonTableSkeleton rowCount={POKEMON_LIMIT} />
                </PokemonTableShell>
                <PaginationNav prevOffset={null} nextOffset={null} to="/basic" />
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

function PokemonTableShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-125">{children}</div>;
}

function PokemonTableContent({ currentOffset }: { currentOffset: number }) {
  const queryKey = getPokemonListQueryKey("suspense", currentOffset);
  const { data, dataUpdatedAt, fetchStatus, isFetching } = useSuspenseQuery({
    queryKey,
    queryFn: getPokemonListQueryFn,
  });

  return (
    <>
      <PokemonTableShell>
        <QueryTrace
          {...getBasicQueryTraceProps(currentOffset)}
          cacheStatus={getCacheStatus(dataUpdatedAt)}
          fetchStatus={getFetchStatus(fetchStatus, isFetching ? "pending" : "success")}
        />
        <PokemonTable pokemon={data.pokemon} />
      </PokemonTableShell>
      <PaginationNav prevOffset={data.prevOffset} nextOffset={data.nextOffset} to="/basic" />
    </>
  );
}
