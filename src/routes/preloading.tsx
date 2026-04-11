import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
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
import { POKEMON_LIMIT, getPokemonListQueryKey, getPokemonListQueryFn } from "~/util/pokemon";

const searchParamsSchema = v.object({
  offset: v.optional(v.number(), 0),
});

// Barely better than basic
// If the component tree is large, the speedup would actually be important
export const Route = createFileRoute("/preloading")({
  validateSearch: searchParamsSchema,
  loaderDeps: ({ search }) => ({
    offset: search.offset,
  }),
  context: ({ deps }) => {
    const newKey = getPokemonListQueryKey("preloading", deps.offset);

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
  const { pokemonListOptions: serverPokemonListOptions } = Route.useRouteContext();

  const { data } = useSuspenseQuery({
    ...serverPokemonListOptions,
  });

  return (
    <main className="min-h-screen bg-warm p-6">
      <div className="max-w-4xl mx-auto">
        <div className="section-header">
          <span className="section-header__title">02_preloading</span>
          <span className="text-charcoal-muted text-sm">// Route-level prefetch</span>
        </div>

        <div className="console-card mb-6">
          <h1 className="text-lg font-mono text-charcoal mb-4">
            National Pokédex: Pokémon {currentOffset + 1}-{currentOffset + POKEMON_LIMIT}
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
              {data.pokemon.map((pokemon) => (
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
          <PaginationNav
            prevOffset={data.prevOffset ?? undefined}
            nextOffset={data.nextOffset ?? undefined}
            to="/preloading"
          />
        </div>
      </div>
    </main>
  );
}
