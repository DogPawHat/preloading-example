import { createFileRoute } from "@tanstack/react-router";
import { useLiveSuspenseQuery, eq, toArray } from "@tanstack/react-db";
import * as v from "valibot";
import { StrategyPageLayout } from "~/components/strategy-page-layout";
import { ConsoleCard } from "~/components/console/console-card";
import { SectionHeader } from "~/components/console/section-header";
import {
  PokedexPagination,
  PokedexTableResults,
  PokedexTableSection,
} from "~/components/tables/pokedex-table-section";
import { POKEMON_LIMIT } from "~/constants";
import { getStrategyArticle } from "~/server/strategy-article.functions";
import {
  pokemonCollection,
  typesCollection,
  pokemonTypesCollection,
} from "~/data/local/collections";

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
    <main className="min-h-screen bg-(--bg-primary) p-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="07_live-query" subtitle="// Electric SQL synced collection" />

        <StrategyPageLayout sidebar={Article}>
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
        </StrategyPageLayout>
      </div>
    </main>
  );
}

function PokemonTableContent({ currentOffset }: { currentOffset: number }) {
  const { data } = useLiveSuspenseQuery(
    (q) =>
      q
        .from({ pokemon: pokemonCollection })
        .orderBy(({ pokemon }) => pokemon.dexId)
        .offset(currentOffset)
        .limit(POKEMON_LIMIT + 1)
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

  const hasMore = data.length > POKEMON_LIMIT;
  const pokemon = (hasMore ? data.slice(0, POKEMON_LIMIT) : data).map((pokemon) => ({
    id: pokemon.id,
    name: pokemon.name,
    types: pokemon.types.map((type) => ({ name: type.name })),
  }));
  const prevOffset = currentOffset > 0 ? Math.max(0, currentOffset - POKEMON_LIMIT) : null;
  const nextOffset = hasMore ? currentOffset + POKEMON_LIMIT : null;

  return (
    <PokedexTableResults
      pokemon={pokemon}
      pagination={
        <PokedexPagination prevOffset={prevOffset} nextOffset={nextOffset} to="/live-query" />
      }
    />
  );
}
