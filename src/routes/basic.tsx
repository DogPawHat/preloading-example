import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import * as v from "valibot";
import { PaginationNav } from "~/components/pagination-nav";
import { StrategyPageLayout } from "~/components/strategy-page-layout";
import { ConsoleCard } from "~/components/console/console-card";
import { SectionHeader } from "~/components/console/section-header";
import { PokemonTableSkeleton } from "~/components/tables/pokemon-table-skeleton";
import { POKEMON_LIMIT } from "~/constants";
import { getPokemonListQueryFn, getPokemonListQueryKey } from "~/utils/pokemon";
import { lazily } from "~/lib/lazily";
import { getStrategyArticle } from "~/server/strategy-article.functions";

const { PokemonTable } = lazily(() => import("~/components/tables/pokemon-table"));

const searchParamsSchema = v.object({
  offset: v.optional(v.number(), 0),
});

export const Route = createFileRoute("/basic")({
  validateSearch: searchParamsSchema,
  loader: async () => {
    const { Renderable: Article } = await getStrategyArticle({
      data: { title: "No prefetching", slug: "basic" },
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
        <SectionHeader title="01_basic" subtitle="// No prefetching (baseline)" />

        <StrategyPageLayout sidebar={Article}>
          <ConsoleCard className="mb-6">
            <h1 className="text-lg font-mono text-(--text-primary) mb-4">
              National Pokédex: Pokémon {currentOffset + 1}-{currentOffset + POKEMON_LIMIT}
            </h1>
            <Suspense
              fallback={
                <>
                  <PokemonTableShell>
                    <PokemonTableSkeleton rowCount={POKEMON_LIMIT} />
                  </PokemonTableShell>
                  <PaginationNav prevOffset={null} nextOffset={null} to="/basic" />
                </>
              }
            >
              <PokemonTableContent currentOffset={currentOffset} />
            </Suspense>
          </ConsoleCard>
        </StrategyPageLayout>
      </div>
    </main>
  );
}

function PokemonTableShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-125">{children}</div>;
}

function PokemonTableContent({ currentOffset }: { currentOffset: number }) {
  const queryKey = getPokemonListQueryKey("suspense", currentOffset);
  const { data } = useSuspenseQuery({
    queryKey,
    queryFn: getPokemonListQueryFn,
  });

  return (
    <>
      <PokemonTableShell>
        <PokemonTable pokemon={data.pokemon} />
      </PokemonTableShell>
      <PaginationNav prevOffset={data.prevOffset} nextOffset={data.nextOffset} to="/basic" />
    </>
  );
}
