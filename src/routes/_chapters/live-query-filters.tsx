import { createFileRoute } from "@tanstack/react-router";
import { useLiveSuspenseQuery, eq, ilike, toArray } from "@tanstack/react-db";
import * as v from "valibot";
import { ChapterSplitColumn } from "~/chapters/chapter-split";
import { ConsoleCard } from "~/demos/components/console-card";
import { FilterForm } from "~/demos/components/filter-form";
import {
  PokedexPagination,
  PokedexTableResults,
  PokedexTableSection,
} from "~/demos/components/pokedex-table-section";
import {
  pokemonCollection,
  pokemonTypesCollection,
  typesCollection,
} from "~/demos/live-query/collections";
import {
  getPokemonListingQueryLimit,
  normalizePokemonNameFilter,
  toPokemonListing,
} from "~/demos/pokemon-listing/pokemon-listing";
import { getArticle } from "~/articles/article.functions";

const searchParamsSchema = v.object({
  offset: v.optional(v.number(), 0),
  name: v.optional(v.string(), ""),
});

export const Route = createFileRoute("/_chapters/live-query-filters")({
  staticData: {
    routeTitle: "08_live-query-filters",
    routeSubtitle: "// Electric SQL live search",
  },
  ssr: false,
  validateSearch: searchParamsSchema,
  loader: async () => {
    const { Renderable: Article } = await getArticle({
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
    <ChapterSplitColumn
      blog={Article}
      table={
        <>
          <ConsoleCard className="mb-6">
            <FilterForm
              initialName={nameFilter}
              onSubmit={(newNameFilter) => {
                void navigate({
                  search: { offset: 0, name: newNameFilter },
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
        </>
      }
    />
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
