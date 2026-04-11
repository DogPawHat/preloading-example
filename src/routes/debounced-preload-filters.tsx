import { createFileRoute } from "@tanstack/react-router";
import { useDebouncedCallback } from "@tanstack/react-pacer";
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useState } from "react";
import * as v from "valibot";
import { FilterForm, FilterSubmitContext } from "~/components/filter-form";
import { PaginationNav } from "~/components/pagination-nav";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
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

// And we have debounced preloading
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

  // Use the filtered results directly from the server
  const filteredPokemon = data.pokemon;

  return (
    <main className="min-h-screen bg-warm p-6">
      <div className="max-w-4xl mx-auto">
        <div className="section-header">
          <span className="section-header__title">06_debounced</span>
          <span className="text-charcoal-muted text-sm">// Advanced filter prefetch</span>
        </div>

        {/* Filter UI */}
        <div className="console-card mb-6">
          <h2 className="text-sm font-semibold mb-4 text-charcoal uppercase tracking-wider">
            Filters
          </h2>
          <p className="text-sm text-charcoal-muted mb-4">
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
        </div>

        <div className="console-card">
          <h1 className="text-lg font-mono text-charcoal mb-4">
            National Pokédex: Pokémon {currentOffset + 1}-{currentOffset + POKEMON_LIMIT}
            {nameFilter && <span className="text-charcoal-muted"> (filtered: "{nameFilter}")</span>}
          </h1>

          <Table className="data-table">
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPokemon.map((pokemon) => (
                <TableRow key={pokemon.name}>
                  <TableCell className="font-mono text-charcoal-muted">{pokemon.id}</TableCell>
                  <TableCell className="capitalize text-charcoal">{pokemon.name}</TableCell>
                  <TableCell>
                    {pokemon.types.map((type) => (
                      <span key={type.name} className="type-badge">
                        {type.name}
                      </span>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPokemon.length === 0 && nameFilter && (
            <div className="text-center py-8 text-charcoal-muted font-mono">
              No Pokemon found matching "{nameFilter}"
            </div>
          )}

          <PaginationNav
            prefetch="viewport"
            prevOffset={data.prevOffset ?? undefined}
            nextOffset={data.nextOffset ?? undefined}
            to="/debounced-preload-filters"
          />
        </div>
      </div>
    </main>
  );
}
