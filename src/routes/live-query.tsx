import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveSuspenseQuery, eq } from "@tanstack/react-db";
import * as v from "valibot";
import { PaginationNav } from "~/components/pagination-nav";
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
  ssr: false,
  validateSearch: searchParamsSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { offset: currentOffset } = Route.useSearch();

  return (
    <main className="min-h-screen bg-(--bg-primary) p-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader title="04_pagination" subtitle="// Preloading next/prev pages" />

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
                <PaginationNav prevOffset={null} nextOffset={null} to="/pagination" />
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
  const { data } = useLiveSuspenseQuery(
    (q) => {
      return q
        .from({
          pokemon: pokemonCollection,
        })
        .orderBy(({ pokemon }) => pokemon.dexId)
        .offset(currentOffset)
        .limit(POKEMON_LIMIT);
    },
    [currentOffset],
  );
  console.log(data);

  return (
    <>
      <div className="min-h-125">
        <PokemonTable pokemon={data as any} />
      </div>
    </>
  );
}
