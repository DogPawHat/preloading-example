import { Suspense, type ComponentProps, type ReactNode } from "react";
import { POKEMON_LIMIT } from "~/constants";
import { lazily } from "~/lib/lazily";
import { PaginationNav } from "~/components/pagination-nav";
import { PokemonTableSkeleton } from "./pokemon-table-skeleton";

const { PokemonTable } = lazily(() => import("./pokemon-table"));

interface Pokemon {
  id: number;
  name: string;
  types: Array<{ name: string }>;
}

interface PokedexTableSectionProps {
  children: ReactNode;
  currentOffset: number;
  fallbackPagination: ReactNode;
  nameFilter?: string;
}

export function PokedexTableSection(props: PokedexTableSectionProps) {
  const { children, currentOffset, fallbackPagination, nameFilter } = props;

  return (
    <>
      <h1 className="text-lg font-mono text-(--text-primary) mb-4">
        National Pokédex: Pokémon {currentOffset + 1}-{currentOffset + POKEMON_LIMIT}
        {nameFilter && (
          <span className="text-(--text-muted)"> (filtered: &quot;{nameFilter}&quot;)</span>
        )}
      </h1>
      <Suspense
        fallback={
          <>
            <PokedexTableShell>
              <PokemonTableSkeleton rowCount={POKEMON_LIMIT} />
            </PokedexTableShell>
            {fallbackPagination}
          </>
        }
      >
        {children}
      </Suspense>
    </>
  );
}

interface PokedexTableResultsProps {
  nameFilter?: string;
  pagination: ReactNode;
  pokemon: Pokemon[];
}

export function PokedexTableResults(props: PokedexTableResultsProps) {
  const { nameFilter, pagination, pokemon } = props;

  return (
    <>
      <PokedexTableShell>
        <PokemonTable pokemon={pokemon} />

        {pokemon.length === 0 && nameFilter && (
          <div className="text-center py-4 text-(--text-muted) font-mono text-sm">
            No Pokémon found matching &quot;{nameFilter}&quot;
          </div>
        )}
      </PokedexTableShell>
      {pagination}
    </>
  );
}

interface PokedexPaginationProps {
  nameFilter?: string;
  nextOffset: number | null;
  prefetch?: "intent" | "viewport" | "render" | false;
  prevOffset: number | null;
  to: ComponentProps<typeof PaginationNav>["to"];
}

export function PokedexPagination(props: PokedexPaginationProps) {
  const { nameFilter, nextOffset, prefetch, prevOffset, to } = props;

  return (
    <PaginationNav
      prefetch={prefetch}
      search={nameFilter == null ? undefined : { name: nameFilter }}
      prevOffset={prevOffset}
      nextOffset={nextOffset}
      to={to}
    />
  );
}

function PokedexTableShell({ children }: { children: ReactNode }) {
  return <div className="min-h-125">{children}</div>;
}
