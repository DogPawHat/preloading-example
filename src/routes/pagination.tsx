import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import * as v from "valibot";
import { PaginationNav } from "~/components/pagination-nav";
import { ConsoleCard } from "~/components/console/console-card";
import { SectionHeader } from "~/components/console/section-header";
import { PokemonTable } from "~/components/console/pokemon-table";
import { POKEMON_LIMIT, getPokemonListQueryKey, getPokemonListQueryFn } from "~/util/pokemon";

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
  const { pokemonListOptions } = Route.useRouteContext();

  const { data } = useSuspenseQuery(pokemonListOptions);

  return (
    <main className="min-h-screen bg-(--bg-primary) p-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader title="04_pagination" subtitle="// Preloading next/prev pages" />

        <ConsoleCard className="mb-6">
          <h1 className="text-lg font-mono text-(--text-primary) mb-4">
            National Pokédex: Pokémon {currentOffset + 1}-{currentOffset + POKEMON_LIMIT}
          </h1>
          <PokemonTable pokemon={data.pokemon} />
          <PaginationNav
            prefetch="viewport"
            prevOffset={data.prevOffset ?? undefined}
            nextOffset={data.nextOffset ?? undefined}
            to="/pagination"
          />
        </ConsoleCard>
      </div>
    </main>
  );
}
