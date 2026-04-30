import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { POKEMON_LIMIT } from "~/demos/pokemon-listing/constants";
import { lazily } from "~/vendor/lazily";
import { PaginationNav } from "~/demos/components/pagination-nav";
import { DemoErrorFallback } from "./demo-error-fallback";
import { PokemonTableSkeleton } from "./pokemon-table-skeleton";

const { PokemonTable } = lazily(() => import("./pokemon-table"));

interface Pokemon {
  id: number;
  name: string;
  types: Array<{ name: string }>;
}

interface PokedexTableSectionProps {
  children: React.ReactNode;
  currentOffset: number;
  fallbackPagination: React.ReactNode;
  nameFilter?: string;
}

export function PokedexTableSection(props: PokedexTableSectionProps) {
  const { children, currentOffset, fallbackPagination, nameFilter } = props;
  const { reset } = useQueryErrorResetBoundary();

  return (
    <>
      <h1 className="text-lg font-mono text-(--text-primary) mb-4">
        National Pokédex: Pokémon {currentOffset + 1}-{currentOffset + POKEMON_LIMIT}
        {nameFilter && (
          <span className="text-(--text-muted)"> (filtered: &quot;{nameFilter}&quot;)</span>
        )}
      </h1>
      <ErrorBoundary onReset={reset} FallbackComponent={DemoErrorFallback}>
        <React.Suspense
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
        </React.Suspense>
      </ErrorBoundary>
    </>
  );
}

interface PokedexTableResultsProps {
  nameFilter?: string;
  pagination: React.ReactNode;
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
  to: React.ComponentProps<typeof PaginationNav>["to"];
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

function PokedexTableShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-125">{children}</div>;
}
