import { createFileRoute } from "@tanstack/react-router";
import { useLiveSuspenseQuery, eq, toArray } from "@tanstack/react-db";
import * as v from "valibot";
import { StrategyChapterLayout } from "~/components/strategy-page-layout";
import { ConsoleCard } from "~/components/console/console-card";
import {
  PokedexPagination,
  PokedexTableResults,
  PokedexTableSection,
} from "~/components/tables/pokedex-table-section";
import { getStrategyArticle } from "~/server/strategy-article.functions";
import {
  pokemonCollection,
  typesCollection,
  pokemonTypesCollection,
} from "~/data/local/collections";
import { getPokemonListingQueryLimit, toPokemonListing } from "~/lib/pokemon-listing";

const searchParamsSchema = v.object({
  offset: v.optional(v.number(), 0),
});

export const Route = createFileRoute("/live-query")({
  ssr: false,
  validateSearch: searchParamsSchema,
  loader: async () => {
    const { Renderable: Article } = await getStrategyArticle({
      data: { title: "Synced collection", slug: "live-query" },
    });
    return { Article };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { offset: currentOffset } = Route.useSearch();
  const { Article } = Route.useLoaderData();

  return (
    <StrategyChapterLayout
      headerTitle="07_live-query"
      headerSubtitle="// Electric SQL synced collection"
      sidebar={Article}
    >
      <ConsoleCard className="mb-6">
        <PokedexTableSection
          currentOffset={currentOffset}
          fallbackPagination={
            <PokedexPagination prevOffset={null} nextOffset={null} to="/live-query" />
          }
        >
          <PokemonTableContent currentOffset={currentOffset} />
        </PokedexTableSection>
      </ConsoleCard>
    </StrategyChapterLayout>
  );
}

function PokemonTableContent({ currentOffset }: { currentOffset: number }) {
  const { data } = useLiveSuspenseQuery(
    (q) =>
      q
        .from({ pokemon: pokemonCollection })
        .orderBy(({ pokemon }) => pokemon.dexId)
        .offset(currentOffset)
        .limit(getPokemonListingQueryLimit())
        .select(({ pokemon }) => ({
          id: pokemon.id,
          name: pokemon.name,
          dexId: pokemon.dexId,
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
        })),
    [currentOffset],
  );

  const listing = toPokemonListing(data, { offset: currentOffset });

  return (
    <PokedexTableResults
      pokemon={listing.pokemon}
      pagination={
        <PokedexPagination
          prevOffset={listing.prevOffset}
          nextOffset={listing.nextOffset}
          to="/live-query"
        />
      }
    />
  );
}
