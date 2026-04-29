import { Suspense, useCallback, useState } from "react";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import * as v from "valibot";
import { FilterForm, FilterSubmitContext } from "~/components/filter-form";
import { PaginationNav } from "~/components/pagination-nav";
import { StrategyPageLayout } from "~/components/strategy-page-layout";
import { ConsoleCard } from "~/components/console/console-card";
import { SectionHeader } from "~/components/console/section-header";
import { PokemonTableSkeleton } from "~/components/tables/pokemon-table-skeleton";
import { POKEMON_LIMIT } from "~/constants";
import { getFilteredPokemonListQueryKey, getFilteredPokemonListQueryFn } from "~/utils/pokemon";
import { lazily } from "~/lib/lazily";
import { getStrategyArticle } from "~/server/strategy-article.functions";

const { PokemonTable } = lazily(() => import("~/components/tables/pokemon-table"));

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
  loaderDeps: ({ search }) => ({
    offset: search.offset,
    name: search.name,
  }),
  context: ({ deps }) => {
    const newKey = getFilteredPokemonListQueryKey("filters", deps.offset, deps.name);

    const pokemonListOptions = queryOptions({
      queryKey: newKey,
      queryFn: getFilteredPokemonListQueryFn,
    });

    return {
      pokemonListOptions,
    };
  },
  loader: async ({ context }) => {
    void context.queryClient.prefetchQuery(context.pokemonListOptions);
    const { Renderable: Article } = await getStrategyArticle({
      data: { title: "Submitted filter prefetch", slug: "filters" },
    });
    return { Article };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { offset: currentOffset, name: nameFilter } = Route.useSearch();
  const { Article } = Route.useLoaderData();
  const navigate = Route.useNavigate();

  return (
    <main className="min-h-screen bg-(--bg-primary) p-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="05_filters" subtitle="// Search with prefetch" />

        <StrategyPageLayout sidebar={Article}>
          {/* Filter UI */}
          <ConsoleCard className="mb-6">
            <h2 className="text-sm font-semibold mb-4 text-(--text-primary) uppercase tracking-wider">
              Filters
            </h2>
            <FilterSubmitContextProvider
              key={`filter-submit-context-provider-${nameFilter}`}
              initialName={nameFilter}
              handleSubmit={(newNameFilter) => {
                void navigate({
                  search: { name: newNameFilter },
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
                  <PaginationNav prevOffset={null} nextOffset={null} to="/filters" />
                </>
              }
            >
              <PokemonTableContent nameFilter={nameFilter} />
            </Suspense>
          </ConsoleCard>
        </StrategyPageLayout>
      </div>
    </main>
  );
}

function PokemonTableContent({ nameFilter }: { nameFilter: string }) {
  const { pokemonListOptions } = useRouteContext({ from: "/filters" });
  const { data } = useSuspenseQuery(pokemonListOptions);
  const filteredPokemon = data.pokemon;

  return (
    <>
      <div className="min-h-125">
        <PokemonTable pokemon={filteredPokemon} />

        {filteredPokemon.length === 0 && nameFilter && (
          <div className="text-center py-4 text-(--text-muted) font-mono text-sm">
            No Pokémon found matching &quot;{nameFilter}&quot;
          </div>
        )}
      </div>
      <PaginationNav
        prefetch="viewport"
        prevOffset={data.prevOffset}
        nextOffset={data.nextOffset}
        to="/filters"
      />
    </>
  );
}
