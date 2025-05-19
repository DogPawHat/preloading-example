import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { buttonVariants } from "~/components/ui/button";

import { useMemo } from "react";
import * as v from "valibot";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { getPokemonList } from "~/util/pokemon";

const POKEMON_LIMIT = 20;

const matchPokemonIdExp = /\/api\/v2\/pokemon\/(\d+)\/?/;

const searchParamsSchema = v.object({
	offset: v.optional(v.number(), 0),
});

export const Route = createFileRoute({
	validateSearch: searchParamsSchema,
	component: RouteComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent,
	pendingComponent: LoadingComponent,
});

interface PokemonListResult {
	name: string;
	url: string;
}

function NotFoundComponent() {
	return <div>Not Found</div>;
}

function ErrorComponent() {
	return <div>Error</div>;
}

function LoadingComponent() {
	return <div>Loading...</div>;
}

function RouteComponent() {
	const { offset: currentOffset } = Route.useSearch();

	const newKey = [
		"pokemon-list",
		"suspense",
		{ limit: POKEMON_LIMIT, offset: currentOffset },
	] as const;

	const { data } = useSuspenseQuery({
		queryKey: newKey,
		queryFn: async () => {
			const result = await getPokemonList({ offset: currentOffset });
			return {
				results: result.pokemon.map((p) => ({
					name: p.name,
					url: `/api/v2/pokemon/${p.id}/`,
				})),
				next:
					result.nextOffset !== null
						? `/api/v2/pokemon/?offset=${result.nextOffset}`
						: null,
				previous:
					result.prevOffset !== null
						? `/api/v2/pokemon/?offset=${result.prevOffset}`
						: null,
			};
		},
	});

	const previousOffset = useMemo(() => {
		if (data?.previous == null) {
			return null;
		}

		return new URL(data.previous).searchParams.get("offset") ?? null;
	}, [data?.previous]);

	const nextOffset = useMemo(() => {
		if (data?.next == null) {
			return null;
		}

		return new URL(data.next).searchParams.get("offset") ?? null;
	}, [data?.next]);

	const results = data.results ?? [];
	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">
				National Pokédex: Pokémon {currentOffset + 1}-
				{currentOffset + POKEMON_LIMIT}
			</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>#</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Details</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{results.map((pokemon: PokemonListResult) => (
						<TableRow key={pokemon.name}>
							<TableCell>{pokemon.url.match(matchPokemonIdExp)?.[1]}</TableCell>
							<TableCell className="capitalize">{pokemon.name}</TableCell>
							<TableCell>
								<a
									href={pokemon.url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 underline"
								>
									View
								</a>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<div className="flex justify-center gap-4 mt-4">
				<Link
					to="/suspense"
					className={buttonVariants({
						variant: "outline",
						className: cn(!previousOffset && "opacity-50 cursor-not-allowed"),
					})}
					search={{ offset: Number(previousOffset) }}
					disabled={!previousOffset}
				>
					Previous
				</Link>
				<Link
					to="/suspense"
					search={{ offset: Number(nextOffset) }}
					className={buttonVariants({
						variant: "outline",
						className: cn(!nextOffset && "opacity-50 cursor-not-allowed"),
					})}
					disabled={!nextOffset}
				>
					Next
				</Link>
			</div>
		</div>
	);
}
