import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import * as v from "valibot";
import { PaginationNav } from "~/components/pagination-nav";
import { ConsoleCard } from "~/components/console/console-card";
import { SectionHeader } from "~/components/console/section-header";
import { PokemonTable } from "~/components/console/pokemon-table";
import { POKEMON_LIMIT, getPokemonListQueryFn, getPokemonListQueryKey } from "~/util/pokemon";

const searchParamsSchema = v.object({
  offset: v.optional(v.number(), 0),
});

export const Route = createFileRoute("/basic")({
  validateSearch: searchParamsSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { offset: currentOffset } = Route.useSearch();

  const { data } = useSuspenseQuery({
    queryKey: getPokemonListQueryKey("suspense", currentOffset),
    queryFn: getPokemonListQueryFn,
  });

  return (
    <main className="min-h-screen bg-(--bg-primary) p-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader title="01_basic" subtitle="// No prefetching (baseline)" />

        <ConsoleCard className="mb-6">
          <h1 className="text-lg font-mono text-(--text-primary) mb-4">
            National Pokédex: Pokémon {currentOffset + 1}-{currentOffset + POKEMON_LIMIT}
          </h1>
          <PokemonTable pokemon={data.pokemon} />
          <PaginationNav
            prevOffset={data.prevOffset ?? undefined}
            nextOffset={data.nextOffset ?? undefined}
            to="/basic"
          />
        </ConsoleCard>
      </div>
    </main>
  );
}
