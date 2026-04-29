import * as React from "react";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import * as v from "valibot";
import { FilterForm, FilterSubmitContext } from "~/components/filter-form";
import { StrategyChapterLayout } from "~/components/strategy-page-layout";
import { ConsoleCard } from "~/components/console/console-card";
import {
  PokedexPagination,
  PokedexTableResults,
  PokedexTableSection,
} from "~/components/tables/pokedex-table-section";
import { getFilteredPokemonListQueryKey, getFilteredPokemonListQueryFn } from "~/utils/pokemon";
import { getStrategyArticle } from "~/server/strategy-article.functions";

const searchParamsSchema = v.object({
  offset: v.optional(v.number(), 0),
  name: v.optional(v.string(), ""),
});

function FilterSubmitContextProvider(props: {
  initialName: string;
  handleSubmit: (nameFilter: string) => void;
  children: React.ReactNode;
}) {
  const [nameFilter, setNameFilter] = React.useState(props.initialName);

  const handleSubmit = React.useCallback(() => {
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
    <StrategyChapterLayout
      headerTitle="05_filters"
      headerSubtitle="// Search with prefetch"
      sidebar={Article}
    >
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
        <PokedexTableSection
          currentOffset={currentOffset}
          nameFilter={nameFilter}
          fallbackPagination={
            <PokedexPagination prevOffset={null} nextOffset={null} to="/filters" />
          }
        >
          <PokemonTableContent nameFilter={nameFilter} />
        </PokedexTableSection>
      </ConsoleCard>
    </StrategyChapterLayout>
  );
}

function PokemonTableContent({ nameFilter }: { nameFilter: string }) {
  const { pokemonListOptions } = useRouteContext({ from: "/filters" });
  const { data } = useSuspenseQuery(pokemonListOptions);
  const filteredPokemon = data.pokemon;

  return (
    <PokedexTableResults
      nameFilter={nameFilter}
      pokemon={filteredPokemon}
      pagination={
        <PokedexPagination
          prefetch="viewport"
          prevOffset={data.prevOffset}
          nextOffset={data.nextOffset}
          to="/filters"
        />
      }
    />
  );
}
