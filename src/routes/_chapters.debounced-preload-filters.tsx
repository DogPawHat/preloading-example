import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { useDebouncedCallback } from "@tanstack/react-pacer";
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import * as v from "valibot";
import { FilterForm } from "~/components/filter-form";
import { BlogTableSplitColumn } from "~/components/blog-table-split-column";
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

function RouteComponent() {
  const { offset: currentOffset, name: nameFilter } = Route.useSearch();
  const { Article } = Route.useLoaderData();
  const queryClient = useQueryClient();
  const { pokemonListOptions: serverPokemonListOptions } = Route.useRouteContext();
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
    <BlogTableSplitColumn
      blog={Article}
      table={
        <>
          <ConsoleCard className="mb-6">
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
