import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useState } from "react";
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
  getServerFilteredPokemonListQueryFn,
} from "~/util/pokemon";

const searchParamsSchema = v.object({
  offset: v.optional(v.number(), 0),
  name: v.optional(v.string(), ""),
});

function FilterSubmitContextProvider(props: {
  initialName: string;
  handleSubmit: (nameFilter: string) => void;
  children: React.ReactNode;
}) {
  const [nameFilter, setNameFilter] = useState(props.initialName);
  const handleSubmit = useCallback(() => {
    props.handleSubmit(nameFilter);
  }, [nameFilter, props]);
  return (
    <FilterSubmitContext.Provider
      value={{ handleSubmit, nameFilter, updateNameFilter: setNameFilter }}
    >
      {props.children}
    </FilterSubmitContext.Provider>
  );
}

export const Route = createFileRoute("/filters")({
  validateSearch: searchParamsSchema,
  loaderDeps: ({ search }) => ({ offset: search.offset, name: search.name }),
  context: ({ deps }) => {
    const pokemonListOptions = queryOptions({
      queryKey: getFilteredPokemonListQueryKey("filters", deps.offset, deps.name),
      queryFn: getServerFilteredPokemonListQueryFn,
    });
    return { pokemonListOptions };
  },
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(context.pokemonListOptions);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { offset: currentOffset, name: nameFilter } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { pokemonListOptions: serverPokemonListOptions } = Route.useRouteContext();
  const queryClient = useQueryClient();

  const { data } = useSuspenseQuery({
    ...serverPokemonListOptions,
    queryFn: useServerFn(getServerFilteredPokemonListQueryFn),
  });

  if (data.prevOffset !== null) {
    void queryClient.prefetchQuery({
      ...serverPokemonListOptions,
      queryKey: getFilteredPokemonListQueryKey("filters", data.prevOffset, nameFilter),
    });
  }

  if (data.nextOffset !== null) {
    void queryClient.prefetchQuery({
      ...serverPokemonListOptions,
      queryKey: getFilteredPokemonListQueryKey("filters", data.nextOffset, nameFilter),
    });
  }

  const filteredPokemon = data.pokemon;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div
          className="text-7xl font-bold"
          style={{ fontFamily: "'Bebas Neue', sans-serif", color: "#0a0a0a", lineHeight: 1 }}
        >
          GEAR 4
        </div>
        <div
          className="text-xs font-bold uppercase tracking-[0.3em] mt-1 text-[#ff2d2d]"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          FILTERED + PREFETCH
        </div>
        <p
          className="text-xs mt-1 text-[#888]"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          Filtered queries with adjacent page prefetch.
        </p>
        <div className="h-1 bg-[#ff2d2d] w-16 mt-3" />
      </div>

      <div className="mb-6 p-4 border-3 border-[#0a0a0a] bg-[#f5f5f5]">
        <h3
          className="text-xs font-bold uppercase tracking-[0.3em] mb-3"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          FILTER
        </h3>
        <FilterSubmitContextProvider
          key={`filter-submit-context-provider-${nameFilter}`}
          initialName={nameFilter}
          handleSubmit={(nameFilter) => {
            void navigate({ search: { name: nameFilter } });
          }}
        >
          <FilterForm />
        </FilterSubmitContextProvider>
      </div>

      <h2
        className="text-sm font-bold uppercase tracking-wider mb-4"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        Pokémon {currentOffset + 1}–{currentOffset + POKEMON_LIMIT}
      </h2>
      <Table>
        <TableHeader>
          <TableRow className="border-b-3 border-[#0a0a0a]">
            <TableHead className="text-xs font-bold uppercase tracking-wider">#</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Name</TableHead>
            <TableHead className="text-xs font-bold uppercase tracking-wider">Types</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPokemon.map((pokemon, i) => (
            <TableRow key={pokemon.name} className={i % 2 === 0 ? "bg-[#f5f5f5]" : ""}>
              <TableCell className="font-bold text-[#888]">{pokemon.id}</TableCell>
              <TableCell className="capitalize font-bold">{pokemon.name}</TableCell>
              <TableCell>
                {pokemon.types.map((type) => (
                  <span
                    key={type.name}
                    className="inline-block px-2 py-0.5 mr-1 text-xs font-bold uppercase bg-[#0a0a0a] text-white"
                  >
                    {type.name}
                  </span>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {filteredPokemon.length === 0 && nameFilter && (
        <div className="text-center py-8 text-[#888] font-bold uppercase tracking-wider text-sm">
          No results for "{nameFilter}"
        </div>
      )}

      <PaginationNav
        prefetch="intent"
        prevOffset={data.prevOffset ?? undefined}
        nextOffset={data.nextOffset ?? undefined}
        to="/filters"
      />
    </div>
  );
}
