import {
	queryOptions,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
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
import { getServerPokemonList } from "~/util/pokemon";

const POKEMON_LIMIT = 20;

const matchPokemonIdExp = /\/api\/v2\/pokemon\/(\d+)\/?/;

const searchParamsSchema = v.object({
	offset: v.optional(v.number(), 0),
});

export const Route = createFileRoute({
	validateSearch: searchParamsSchema,
	loaderDeps: ({ search }) => ({
		offset: search.offset,
	}),
	context: ({ deps }) => {
		const newKey = [
			"pokemon-list",
			"pagination",
			{ limit: POKEMON_LIMIT, offset: deps.offset },
		] as const;

		const pokemonListOptions = queryOptions({
			queryKey: newKey,
			queryFn: async ({ queryKey }) => {
				const result = await getServerPokemonList({
					data: { offset: queryKey[2].offset },
				});

				return result.pokemon;
			},
		});

		return {
			pokemonListOptions,
		};
	},
	loader: ({ context }) => {
		context.queryClient.prefetchQuery(context.pokemonListOptions);
	},
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
	const { pokemonListOptions } = Route.useRouteContext();
	const queryClient = useQueryClient();

	const { data } = useSuspenseQuery(pokemonListOptions);

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

	if (previousOffset !== null) {
		void queryClient.prefetchQuery({
			...pokemonListOptions,
			queryKey: [
				"pokemon-list",
				"pagination",
				{ limit: POKEMON_LIMIT, offset: Number(previousOffset) },
			],
		});
	}

	if (nextOffset !== null) {
		void queryClient.prefetchQuery({
			...pokemonListOptions,
			queryKey: [
				"pokemon-list",
				"pagination",
				{ limit: POKEMON_LIMIT, offset: Number(nextOffset) },
			],
		});
	}

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
					to="/pagination"
					preload="intent"
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
					to="/pagination"
					preload="intent"
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
