import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useLiveSuspenseQuery, eq, ilike, toArray } from "@tanstack/react-db";
import * as v from "valibot";
import { StrategyChapterLayout } from "~/components/strategy-page-layout";
import { ConsoleCard } from "~/components/console/console-card";
import { FilterForm, FilterSubmitContext } from "~/components/filter-form";
import {
  PokedexPagination,
  PokedexTableResults,
  PokedexTableSection,
} from "~/components/tables/pokedex-table-section";
import {
  pokemonCollection,
  pokemonTypesCollection,
  typesCollection,
} from "~/data/local/collections";
import {
  getPokemonListingQueryLimit,
  normalizePokemonNameFilter,
  toPokemonListing,
} from "~/lib/pokemon-listing";
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

export const Route = createFileRoute("/live-query-filters")({
  ssr: false,
  validateSearch: searchParamsSchema,
  loader: async () => {
    const { Renderable: Article } = await getStrategyArticle({
      data: { title: "Reactive filtered data", slug: "live-query-filters" },
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
      headerTitle="08_live-query-filters"
      headerSubtitle="// Electric SQL live search"
      sidebar={Article}
    >
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
          <PokedexTableSection
            currentOffset={currentOffset}
            nameFilter={nameFilter}
            fallbackPagination={
              <PokedexPagination
                nameFilter={nameFilter}
                nextOffset={null}
                prevOffset={null}
                to="/live-query-filters"
              />
            }
          >
            <PokemonTableContent currentOffset={currentOffset} nameFilter={nameFilter} />
          </PokedexTableSection>
        </ConsoleCard>
      </div>
    </StrategyChapterLayout>
  );
}

function PokemonTableContent({
  currentOffset,
  nameFilter,
}: {
  currentOffset: number;
  nameFilter: string;
}) {
  const trimmedNameFilter = normalizePokemonNameFilter(nameFilter);
  const { data } = useLiveSuspenseQuery(
    (q) => {
      let query = q.from({ pokemon: pokemonCollection });

      if (trimmedNameFilter) {
        query = query.where(({ pokemon }) => ilike(pokemon.name, `%${trimmedNameFilter}%`));
      }

      return query
        .orderBy(({ pokemon }) => pokemon.dexId)
        .offset(currentOffset)
        .limit(getPokemonListingQueryLimit())
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

  const listing = toPokemonListing(data, { offset: currentOffset, nameFilter });

  return (
    <PokedexTableResults
      nameFilter={nameFilter}
      pokemon={listing.pokemon}
      pagination={
        <PokedexPagination
          nameFilter={nameFilter}
          prevOffset={listing.prevOffset}
          nextOffset={listing.nextOffset}
          to="/live-query-filters"
        />
      }
    />
  );
}
