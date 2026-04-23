import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import * as v from "valibot";
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
          <div className="min-h-[500px]">
            <Suspense fallback={<PokemonTableSkeleton rowCount={POKEMON_LIMIT} />}>
              <PokemonTableContent currentOffset={currentOffset} />
            </Suspense>
          </div>
          <PaginationNavOutlet />
        </ConsoleCard>
      </div>
    </main>
  );
}

function PokemonTableContent({ currentOffset }: { currentOffset: number }) {
  const { data } = useSuspenseQuery({
    queryKey: getPokemonListQueryKey("suspense", currentOffset),
    queryFn: getPokemonListQueryFn,
  });

  return <PokemonTable pokemon={data.pokemon} />;
}

function PaginationNavOutlet() {
  const { offset: currentOffset } = Route.useSearch();
  const { data, isPending } = useQuery({
    queryKey: getPokemonListQueryKey("suspense", currentOffset),
    queryFn: getPokemonListQueryFn,
  });

  return (
    <PaginationNav
      prevOffset={isPending ? undefined : (data?.prevOffset ?? undefined)}
      nextOffset={isPending ? undefined : (data?.nextOffset ?? undefined)}
      to="/basic"
    />
  );
}
