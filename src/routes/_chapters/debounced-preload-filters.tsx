import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { useDebouncedCallback } from "@tanstack/react-pacer";
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import * as v from "valibot";
import { FilterForm } from "~/demos/components/filter-form";
import { ChapterSplitColumn } from "~/chapters/chapter-split";
import { DemoCard } from "~/demos/components/demo-card";
import {
  PokedexPagination,
  PokedexTableResults,
  PokedexTableSection,
} from "~/demos/components/pokedex-table-section";
import {
  getFilteredPokemonListQueryKey,
  getFilteredPokemonListQueryFn,
} from "~/demos/query/pokemon-query";
import { getArticleQueryOptions } from "~/articles/article.functions";

const searchParamsSchema = v.object({
  offset: v.optional(v.number(), 0),
  name: v.optional(v.string(), ""),
});

export const Route = createFileRoute("/_chapters/debounced-preload-filters")({
  staticData: {
    routeTitle: "06_debounced",
    routeSubtitle: "// Advanced filter prefetch",
  },
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

    const debouncedArticleQueryOptions = getArticleQueryOptions({
      slug: "debounced-preload-filters",
    });

    return {
      pokemonListOptions,
      debouncedArticleQueryOptions,
    };
  },
  loader: async ({
    context: { queryClient, pokemonListOptions, debouncedArticleQueryOptions },
  }) => {
    void queryClient.prefetchQuery(pokemonListOptions);
    await queryClient.ensureQueryData(debouncedArticleQueryOptions);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { offset: currentOffset, name: nameFilter } = Route.useSearch();
  const { debouncedArticleQueryOptions, pokemonListOptions: serverPokemonListOptions } =
    Route.useRouteContext();
  const queryClient = useQueryClient();

  const {
    data: { article },
  } = useSuspenseQuery(debouncedArticleQueryOptions);
  const navigate = Route.useNavigate();
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

  return (
    <ChapterSplitColumn
      blog={article}
      table={
        <>
          <DemoCard className="mb-6">
            <FilterForm
              initialName={nameFilter}
              description="Preloads results while typing (debounced 100ms)"
              onNameChange={(newNameFilter) => debouncedNameFilter(newNameFilter)}
              onSubmit={(newNameFilter) => {
                void navigate({
                  search: { name: newNameFilter },
                });
              }}
            />
          </DemoCard>

          <DemoCard>
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
          </DemoCard>
        </>
      }
    />
  );
}

function PokemonTableContent({ nameFilter }: { nameFilter: string }) {
  const { pokemonListOptions } = useRouteContext({ from: "/_chapters/debounced-preload-filters" });
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
