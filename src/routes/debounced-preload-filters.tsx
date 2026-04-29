import * as React from "react";
import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { useDebouncedCallback } from "@tanstack/react-pacer";
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
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
  loader: async ({ context }) => {
    void context.queryClient.prefetchQuery(context.pokemonListOptions);
    const { Renderable: Article } = await getStrategyArticle({
      data: { title: "Debounced filter prefetch", slug: "debounced-preload-filters" },
    });
    return { Article };
  },
  component: RouteComponent,
});

function PreloadFilterSubmitContextProvider(props: {
  initialName: string;
  handleSubmit: (nameFilter: string) => void;
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const { pokemonListOptions: serverPokemonListOptions } = Route.useRouteContext();
  const [nameFilter, setNameFilter] = React.useState(props.initialName);

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

  const updateNameFilter = React.useCallback(
    (value: string) => {
      debouncedNameFilter(value);
      setNameFilter(value);
    },
    [debouncedNameFilter],
  );

  const handleSubmit = React.useCallback(() => {
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
  const { Article } = Route.useLoaderData();
  const navigate = Route.useNavigate();

  return (
    <StrategyChapterLayout
      headerTitle="06_debounced"
      headerSubtitle="// Advanced filter prefetch"
      sidebar={Article}
    >
      <ConsoleCard className="mb-6">
        <h2 className="text-sm font-semibold mb-4 text-(--text-primary) uppercase tracking-wider">
          Filters
        </h2>
        <p className="text-sm text-(--text-muted) mb-4">
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
      </ConsoleCard>

      <ConsoleCard>
        <PokedexTableSection
          currentOffset={currentOffset}
          nameFilter={nameFilter}
          fallbackPagination={
            <PokedexPagination
              prevOffset={null}
              nextOffset={null}
              to="/debounced-preload-filters"
            />
          }
        >
          <PokemonTableContent nameFilter={nameFilter} />
        </PokedexTableSection>
      </ConsoleCard>
    </StrategyChapterLayout>
  );
}

function PokemonTableContent({ nameFilter }: { nameFilter: string }) {
  const { pokemonListOptions } = useRouteContext({ from: "/debounced-preload-filters" });
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
          to="/debounced-preload-filters"
        />
      }
    />
  );
}
