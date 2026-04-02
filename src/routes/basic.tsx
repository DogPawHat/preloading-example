import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
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
import {
  POKEMON_LIMIT,
  getPokemonListQueryFn,
  getPokemonListQueryKey,
} from "~/util/pokemon";

const searchParamsSchema = v.object({
  offset: v.optional(v.number(), 0),
});

// Complete shite
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
    <main className="min-h-screen bg-warm p-6">
      <div className="max-w-4xl mx-auto">
        <div className="section-header">
          <span className="section-header__title">01_basic</span>
          <span className="text-charcoal-muted text-sm">
            // No prefetching (baseline)
          </span>
        </div>

        <div className="console-card mb-6">
          <h1 className="text-lg font-mono text-charcoal mb-4">
            National Pokédex: Pokémon {currentOffset + 1}-
            {currentOffset + POKEMON_LIMIT}
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
                  <TableCell className="font-mono text-charcoal-muted">
                    {pokemon.id}
                  </TableCell>
                  <TableCell className="capitalize text-charcoal">
                    {pokemon.name}
                  </TableCell>
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
            to="/basic"
            currentOffset={currentOffset}
          />
        </div>
      </div>
    </main>
  );
}
