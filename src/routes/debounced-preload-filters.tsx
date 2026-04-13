import { createFileRoute } from "@tanstack/react-router";
import { useDebouncedCallback } from "@tanstack/react-pacer";
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import * as v from "valibot";
import { FilterForm, FilterSubmitContext } from "~/components/filter-form";
import { PaginationNav } from "~/components/pagination-nav";
import { ConsoleCard } from "~/components/console/console-card";
import { SectionHeader } from "~/components/console/section-header";
import { PokemonTable } from "~/components/console/pokemon-table";
import {
  POKEMON_LIMIT,
  getFilteredPokemonListQueryKey,
  getFilteredPokemonListQueryFn,
} from "~/util/pokemon";

const searchParamsSchema = v.object({
  offset: v.optional(v.number(), 0),
  name: v.optional(v.string(), ""),
});

export const Route = createFileRoute("/debounced-preload-filters")({
  validateSearch: searchParamsSchema,
  loaderDeps: ({ search }) => ({
    offset: search.offset,
    name: search.name,
  }),
  context: ({ deps }) => {
    const newKey = getFilteredPokemonListQueryKey(
      "debounced-preload-filters",
      deps.offset,
      deps.name,
    );

    const pokemonListOptions = queryOptions({
      queryKey: newKey,
      queryFn: getFilteredPokemonListQueryFn,
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

function PreloadFilterSubmitContextProvider(props: {
  initialName: string;
  handleSubmit: (nameFilter: string) => void;
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const { pokemonListOptions: serverPokemonListOptions } = Route.useRouteContext();
  const [nameFilter, setNameFilter] = useState(props.initialName);

  const debouncedNameFilter = useDebouncedCallback(
    (newNameFilter: string) => {
      void queryClient.prefetchQuery({
        queryKey: getFilteredPokemonListQueryKey(
          serverPokemonListOptions.queryKey[1],
          serverPokemonListOptions.queryKey[2].offset,
          newNameFilter,
        ),
        queryFn: getFilteredPokemonListQueryFn,
      });
    },
    {
      wait: 100,
    },
  );

  const updateNameFilter = useCallback(
    (value: string) => {
      debouncedNameFilter(value);
      setNameFilter(value);
    },
    [debouncedNameFilter],
  );

  const handleSubmit = useCallback(() => {
    props.handleSubmit(nameFilter);
  }, [nameFilter, props]);

  return (
    <FilterSubmitContext.Provider value={{ handleSubmit, nameFilter, updateNameFilter }}>
      {props.children}
    </FilterSubmitContext.Provider>
  );
}

function RouteComponent() {
  const { offset: currentOffset, name: nameFilter } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { pokemonListOptions } = Route.useRouteContext();

  const { data } = useSuspenseQuery(pokemonListOptions);

  const filteredPokemon = data.pokemon;

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] p-6">
      <div className="max-w-4xl mx-auto">
        <SectionHeader title="06_debounced" subtitle="// Advanced filter prefetch" />

        {/* Filter UI */}
        <ConsoleCard className="mb-6">
          <h2 className="text-sm font-semibold mb-4 text-[var(--text-primary)] uppercase tracking-wider">
            Filters
          </h2>
          <p className="text-sm text-[var(--text-muted)] mb-4">
            Preloads results while typing (debounced 100ms)
          </p>
          <PreloadFilterSubmitContextProvider
            initialName={nameFilter}
            handleSubmit={(newNameFilter) => {
              void navigate({
                search: { name: newNameFilter },
              });
            }}
          >
            <FilterForm />
          </PreloadFilterSubmitContextProvider>
        </ConsoleCard>

        <ConsoleCard>
          <h1 className="text-lg font-mono text-[var(--text-primary)] mb-4">
            National Pokédex: Pokémon {currentOffset + 1}-{currentOffset + POKEMON_LIMIT}
            {nameFilter && (
              <span className="text-[var(--text-muted)]">
                {" "}
                (filtered: &quot;{nameFilter}&quot;)
              </span>
            )}
          </h1>

          <PokemonTable pokemon={filteredPokemon} />

          {filteredPokemon.length === 0 && nameFilter && (
            <div className="text-center py-8 text-[var(--text-muted)] font-mono">
              No Pokemon found matching &quot;{nameFilter}&quot;
            </div>
          )}

          <PaginationNav
            prefetch="viewport"
            prevOffset={data.prevOffset ?? undefined}
            nextOffset={data.nextOffset ?? undefined}
            to="/debounced-preload-filters"
          />
        </ConsoleCard>
      </div>
    </main>
  );
}
