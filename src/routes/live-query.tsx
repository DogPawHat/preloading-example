import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveSuspenseQuery, eq, toArray } from "@tanstack/react-db";
import * as v from "valibot";
import { PaginationNav } from "~/components/pagination-nav";
import { StrategyPageLayout } from "~/components/strategy-page-layout";
import { ConsoleCard } from "~/components/console/console-card";
import { SectionHeader } from "~/components/console/section-header";
import { PokemonTableSkeleton } from "~/components/console/pokemon-table-skeleton";
import { POKEMON_LIMIT } from "~/constants";
import { lazily } from "~/util/lazily";
import { pokemonCollection, typesCollection, pokemonTypesCollection } from "~/lib/collections";

const { PokemonTable } = lazily(() => import("~/components/console/pokemon-table"));

const searchParamsSchema = v.object({
  offset: v.optional(v.number(), 0),
});

export const Route = createFileRoute("/live-query")({
  validateSearch: searchParamsSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { offset: currentOffset } = Route.useSearch();

  return (
    <main className="min-h-screen bg-(--bg-primary) p-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="07_live-query" subtitle="// Electric SQL synced collection" />

        <StrategyPageLayout articleEyebrow="Live query" articleTitle="Synced collection">
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
                  <PaginationNav prevOffset={null} nextOffset={null} to="/live-query" />
                </>
              }
            >
              <PokemonTableContent currentOffset={currentOffset} />
            </Suspense>
          </ConsoleCard>
        </StrategyPageLayout>
      </div>
    </main>
  );
}

function PokemonTableContent({ currentOffset }: { currentOffset: number }) {
  const { data } = useLiveSuspenseQuery(
    (q) =>
      q
        .from({ pokemon: pokemonCollection })
        .orderBy(({ pokemon }) => pokemon.dexId)
        .offset(currentOffset)
        .limit(POKEMON_LIMIT + 1)
        .select(({ pokemon }) => ({
          id: pokemon.id,
          name: pokemon.name,
          dexId: pokemon.dexId,
          types: toArray(
            q
              .from({ pokemonType: pokemonTypesCollection })
              .join(
                { type: typesCollection },
                ({ pokemonType, type }) => eq(pokemonType.typeId, type.id),
                "inner",
              )
              .where(({ pokemonType }) => eq(pokemonType.pokemonId, pokemon.id))
              .orderBy(({ pokemonType }) => pokemonType.id)
              .select(({ type }) => ({ name: type.name })),
          ),
        })),
    [currentOffset],
  );

  const hasMore = data.length > POKEMON_LIMIT;
  const pokemon = (hasMore ? data.slice(0, POKEMON_LIMIT) : data).map((pokemon) => ({
    id: pokemon.id,
    name: pokemon.name,
    types: pokemon.types.map((type) => ({ name: type.name })),
  }));
  const prevOffset = currentOffset > 0 ? Math.max(0, currentOffset - POKEMON_LIMIT) : null;
  const nextOffset = hasMore ? currentOffset + POKEMON_LIMIT : null;

  return (
    <>
      <div className="min-h-125">
        <PokemonTable pokemon={pokemon} />
      </div>
      <PaginationNav prevOffset={prevOffset} nextOffset={nextOffset} to="/live-query" />
    </>
  );
}
