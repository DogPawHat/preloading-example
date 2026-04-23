import { Suspense } from "react";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { queryOptions, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import * as v from "valibot";
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

export const Route = createFileRoute("/pagination")({
  validateSearch: searchParamsSchema,
  loaderDeps: ({ search }) => ({
    offset: search.offset,
  }),
  context: ({ deps }) => {
    const newKey = getPokemonListQueryKey("pagination", deps.offset);

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
        <SectionHeader title="04_pagination" subtitle="// Preloading next/prev pages" />

        <ConsoleCard className="mb-6">
          <h1 className="text-lg font-mono text-(--text-primary) mb-4">
            National Pokédex: Pokémon {currentOffset + 1}-{currentOffset + POKEMON_LIMIT}
          </h1>
          <div className="min-h-[500px]">
            <Suspense fallback={<PokemonTableSkeleton rowCount={POKEMON_LIMIT} />}>
              <PokemonTableContent />
            </Suspense>
          </div>
          <PaginationNavOutlet />
        </ConsoleCard>
      </div>
    </main>
  );
}

function PokemonTableContent() {
  const { pokemonListOptions } = useRouteContext({ from: "/pagination" });
  const { data } = useSuspenseQuery(pokemonListOptions);

  return <PokemonTable pokemon={data.pokemon} />;
}

function PaginationNavOutlet() {
  const { pokemonListOptions } = useRouteContext({ from: "/pagination" });
  const { data, isPending } = useQuery(pokemonListOptions);

  return (
    <PaginationNav
      prefetch="viewport"
      prevOffset={isPending ? undefined : (data?.prevOffset ?? undefined)}
      nextOffset={isPending ? undefined : (data?.nextOffset ?? undefined)}
      to="/pagination"
    />
  );
}
