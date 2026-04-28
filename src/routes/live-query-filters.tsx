import { Suspense, useCallback, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveSuspenseQuery, eq, ilike, toArray } from "@tanstack/react-db";
import * as v from "valibot";
import { StrategyPageLayout } from "~/components/strategy-page-layout";
import { ConsoleCard } from "~/components/console/console-card";
import { PokemonTableSkeleton } from "~/components/console/pokemon-table-skeleton";
import { SectionHeader } from "~/components/console/section-header";
import { FilterForm, FilterSubmitContext } from "~/components/filter-form";
import { pokemonCollection, pokemonTypesCollection, typesCollection } from "~/lib/collections";
import { cn } from "~/lib/utils";
import { POKEMON_LIMIT } from "~/constants";
import { lazily } from "~/util/lazily";

const { PokemonTable } = lazily(() => import("~/components/console/pokemon-table"));

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

export const Route = createFileRoute("/live-query-filters")({
  ssr: false,
  validateSearch: searchParamsSchema,
  component: RouteComponent,
});

function RouteComponent() {
  const { offset: currentOffset, name: nameFilter } = Route.useSearch();
  const navigate = Route.useNavigate();

  return (
    <main className="min-h-screen bg-(--bg-primary) p-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="08_live-query-filters" subtitle="// Electric SQL live search" />

        <StrategyPageLayout articleEyebrow="Live search" articleTitle="Reactive filtered data">
          <div>
            <ConsoleCard className="mb-6">
              <h2 className="text-sm font-semibold mb-4 text-(--text-primary) uppercase tracking-wider">
                Filters
              </h2>
              <FilterSubmitContextProvider
                key={`live-filter-submit-context-provider-${nameFilter}`}
                initialName={nameFilter}
                handleSubmit={(newNameFilter) => {
                  void navigate({
                    search: { offset: 0, name: newNameFilter },
                  });
                }}
              >
                <FilterForm />
              </FilterSubmitContextProvider>
            </ConsoleCard>

            <ConsoleCard>
              <h1 className="text-lg font-mono text-(--text-primary) mb-4">
                National Pokédex: Pokémon {currentOffset + 1}-{currentOffset + POKEMON_LIMIT}
                {nameFilter && (
                  <span className="text-(--text-muted)"> (filtered: &quot;{nameFilter}&quot;)</span>
                )}
              </h1>

              <Suspense
                fallback={
                  <>
                    <div className="min-h-125">
                      <PokemonTableSkeleton rowCount={POKEMON_LIMIT} />
                    </div>
                    <LiveQueryFiltersPagination
                      nameFilter={nameFilter}
                      nextOffset={null}
                      prevOffset={null}
                    />
                  </>
                }
              >
                <PokemonTableContent currentOffset={currentOffset} nameFilter={nameFilter} />
              </Suspense>
            </ConsoleCard>
          </div>
        </StrategyPageLayout>
      </div>
    </main>
  );
}

function PokemonTableContent({
  currentOffset,
  nameFilter,
}: {
  currentOffset: number;
  nameFilter: string;
}) {
  const trimmedNameFilter = nameFilter.trim();
  const { data } = useLiveSuspenseQuery(
    (q) => {
      let query = q.from({ pokemon: pokemonCollection });

      if (trimmedNameFilter) {
        query = query.where(({ pokemon }) => ilike(pokemon.name, `%${trimmedNameFilter}%`));
      }

      return query
        .orderBy(({ pokemon }) => pokemon.dexId)
        .offset(currentOffset)
        .limit(POKEMON_LIMIT + 1)
        .select(({ pokemon }) => ({
          id: pokemon.id,
          name: pokemon.name,
          types: toArray(
            q
              .from({ pokemonType: pokemonTypesCollection })
              .join(
                { type: typesCollection },
                ({ pokemonType, type }) => eq(pokemonType.typeId, type.id),
                "inner",
              )
              .where(({ pokemonType }) => eq(pokemonType.pokemonId, pokemon.id))
              .orderBy(({ pokemonType }) => pokemonType.id)
              .select(({ type }) => ({ name: type.name })),
          ),
        }));
    },
    [currentOffset, trimmedNameFilter],
  );

  const hasMore = data.length > POKEMON_LIMIT;
  const pokemon = (hasMore ? data.slice(0, POKEMON_LIMIT) : data).map((pokemon) => ({
    id: pokemon.id,
    name: pokemon.name,
    types: pokemon.types.map((type) => ({ name: type.name })),
  }));
  const prevOffset = currentOffset > 0 ? Math.max(0, currentOffset - POKEMON_LIMIT) : null;
  const nextOffset = hasMore ? currentOffset + POKEMON_LIMIT : null;

  return (
    <>
      <div className="min-h-125">
        <PokemonTable pokemon={pokemon} />

        {pokemon.length === 0 && nameFilter && (
          <div className="text-center py-4 text-(--text-muted) font-mono text-sm">
            No Pokémon found matching &quot;{nameFilter}&quot;
          </div>
        )}
      </div>
      <LiveQueryFiltersPagination
        nameFilter={nameFilter}
        prevOffset={prevOffset}
        nextOffset={nextOffset}
      />
    </>
  );
}

function LiveQueryFiltersPagination(props: {
  nameFilter: string;
  prevOffset: number | null;
  nextOffset: number | null;
}) {
  const { nameFilter, prevOffset, nextOffset } = props;

  return (
    <nav className="flex items-center justify-center gap-1 mt-8 font-mono">
      <Link
        to="/live-query-filters"
        search={{ offset: prevOffset ?? 0, name: nameFilter }}
        disabled={prevOffset == null}
        className={cn(
          "inline-flex items-center gap-2",
          "px-3 py-2",
          "border border-(--border-default)",
          "bg-(--bg-secondary)",
          "font-mono text-sm",
          "text-(--text-primary)",
          "transition-all duration-fast ease-default",
          "hover:border-(--accent-default) hover:bg-(--accent-subtle)",
          prevOffset == null && "opacity-50 cursor-not-allowed pointer-events-none",
        )}
      >
        <span>&lt;</span>
        <span>prev</span>
      </Link>

      <span className="px-2 text-(--text-muted)">|</span>

      <Link
        to="/live-query-filters"
        search={{ offset: nextOffset ?? 0, name: nameFilter }}
        disabled={nextOffset == null}
        className={cn(
          "inline-flex items-center gap-2",
          "px-3 py-2",
          "border border-(--border-default)",
          "bg-(--bg-secondary)",
          "font-mono text-sm",
          "text-(--text-primary)",
          "transition-all duration-fast ease-default",
          "hover:border-(--accent-default) hover:bg-(--accent-subtle)",
          nextOffset == null && "opacity-50 cursor-not-allowed pointer-events-none",
        )}
      >
        <span>next</span>
        <span>&gt;</span>
      </Link>
    </nav>
  );
}
