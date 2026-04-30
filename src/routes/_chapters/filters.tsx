import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
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

export const Route = createFileRoute("/_chapters/filters")({
  staticData: {
    routeTitle: "05_filters",
    routeSubtitle: "// Search with prefetch",
  },
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

    const filtersArticleQueryOptions = getArticleQueryOptions({
      slug: "filters",
    });

    return {
      pokemonListOptions,
      filtersArticleQueryOptions,
    };
  },
  loader: async ({ context: { queryClient, pokemonListOptions, filtersArticleQueryOptions } }) => {
    void queryClient.prefetchQuery(pokemonListOptions);
    await queryClient.ensureQueryData(filtersArticleQueryOptions);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { offset: currentOffset, name: nameFilter } = Route.useSearch();
  const { filtersArticleQueryOptions } = Route.useRouteContext();
  const navigate = Route.useNavigate();

  const {
    data: { article },
  } = useSuspenseQuery(filtersArticleQueryOptions);

  return (
    <ChapterSplitColumn
      blog={article}
      table={
        <>
          <DemoCard className="mb-6">
            <FilterForm
              initialName={nameFilter}
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
                <PokedexPagination prevOffset={null} nextOffset={null} to="/filters" />
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
  const { pokemonListOptions } = useRouteContext({ from: "/_chapters/filters" });
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
