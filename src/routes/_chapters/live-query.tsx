import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLiveSuspenseQuery, eq, toArray } from "@tanstack/react-db";
import * as v from "valibot";
import { ChapterSplitColumn } from "~/chapters/chapter-split";
import { DemoCard } from "~/demos/components/demo-card";
import {
  PokedexPagination,
  PokedexTableResults,
  PokedexTableSection,
} from "~/demos/components/pokedex-table-section";
import { getArticleQueryOptions } from "~/articles/article.functions";
import {
  pokemonCollection,
  typesCollection,
  pokemonTypesCollection,
} from "~/demos/live-query/collections";
import {
  getPokemonListingQueryLimit,
  toPokemonListing,
} from "~/demos/pokemon-listing/pokemon-listing";

const searchParamsSchema = v.object({
  offset: v.optional(v.number(), 0),
});

export const Route = createFileRoute("/_chapters/live-query")({
  staticData: {
    routeTitle: "07_live-query",
    routeSubtitle: "// Electric SQL synced collection",
  },
  ssr: false,
  validateSearch: searchParamsSchema,
  context: () => {
    const liveQueryArticleQueryOptions = getArticleQueryOptions({
      title: "Synced collection",
      slug: "live-query",
    });
    return { liveQueryArticleQueryOptions };
  },
  loader: async ({ context: { queryClient, liveQueryArticleQueryOptions } }) => {
    await queryClient.ensureQueryData(liveQueryArticleQueryOptions);
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { offset: currentOffset } = Route.useSearch();
  const { liveQueryArticleQueryOptions } = Route.useRouteContext();

  const {
    data: { article },
  } = useSuspenseQuery(liveQueryArticleQueryOptions);

  return (
    <ChapterSplitColumn
      blog={article}
      table={
        <DemoCard className="mb-6">
          <PokedexTableSection
            currentOffset={currentOffset}
            fallbackPagination={
              <PokedexPagination prevOffset={null} nextOffset={null} to="/live-query" />
            }
          >
            <PokemonTableContent currentOffset={currentOffset} />
          </PokedexTableSection>
        </DemoCard>
      }
    />
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
