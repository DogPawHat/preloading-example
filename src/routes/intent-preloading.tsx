import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import { PaginationNav } from "~/components/pagination-nav";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { POKEMON_LIMIT, getPokemonListQueryKey, getServerPokemonListQueryFn } from "~/util/pokemon";

const searchParamsSchema = v.object({
  offset: v.optional(v.number(), 0),
});

// Now we're sucking diesel
export const Route = createFileRoute("/intent-preloading")({
  validateSearch: searchParamsSchema,
  loaderDeps: ({ search }) => ({ offset: search.offset }),
  context: ({ deps }) => {
    const pokemonListOptions = queryOptions({
      queryKey: getPokemonListQueryKey("intent-preloading", deps.offset),
      queryFn: getServerPokemonListQueryFn,
    });
    return { pokemonListOptions };
  },
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(context.pokemonListOptions);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { offset: currentOffset } = Route.useSearch();
  const { pokemonListOptions: serverPokemonListOptions } = Route.useRouteContext();

  const { data } = useSuspenseQuery({
    ...serverPokemonListOptions,
    queryFn: useServerFn(getServerPokemonListQueryFn),
  });

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div
          className="text-7xl font-bold"
          style={{ fontFamily: "'Bebas Neue', sans-serif", color: "#0a0a0a", lineHeight: 1 }}
        >
          GEAR 2
        </div>
        <div
          className="text-xs font-bold uppercase tracking-[0.3em] mt-1 text-[#ff2d2d]"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          HOVER PREFETCH
        </div>
        <p
          className="text-xs mt-1 text-[#888]"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          Prefetch on hover intent. Sub-100ms head start.
        </p>
        <div className="h-1 bg-[#ff2d2d] w-16 mt-3" />
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
          {data.pokemon.map((pokemon, i) => (
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
      <PaginationNav
        prefetch="intent"
        prevOffset={data.prevOffset ?? undefined}
        nextOffset={data.nextOffset ?? undefined}
        to="/intent-preloading"
      />
    </div>
  );
}
