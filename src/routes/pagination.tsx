import {
	queryOptions,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { buttonVariants } from "~/components/ui/button";

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
import { POKEMON_LIMIT, getServerPokemonList } from "~/util/pokemon";

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
			{ offset: deps.offset },
		] as const;

		const pokemonListOptions = queryOptions({
			queryKey: newKey,
			queryFn: async ({ queryKey }) => {
				return await getServerPokemonList({
					data: { offset: queryKey[2].offset },
				});
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

	if (data.prevOffset !== null) {
		void queryClient.prefetchQuery({
			...pokemonListOptions,
			queryKey: ["pokemon-list", "pagination", { offset: data.prevOffset }],
		});
	}

	if (data.nextOffset !== null) {
		void queryClient.prefetchQuery({
			...pokemonListOptions,
			queryKey: ["pokemon-list", "pagination", { offset: data.nextOffset }],
		});
	}

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
					{data.pokemon.map((pokemon) => (
						<TableRow key={pokemon.name}>
							<TableCell>{pokemon.id}</TableCell>
							<TableCell className="capitalize">{pokemon.name}</TableCell>
							<TableCell>
								{pokemon.types.map((type) => (
									<span key={type.type.name}>{type.type.name}</span>
								))}
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
						className: cn(!data.prevOffset && "opacity-50 cursor-not-allowed"),
					})}
					search={{ offset: Number(data.prevOffset) }}
					disabled={!data.prevOffset}
				>
					Previous
				</Link>
				<Link
					to="/pagination"
					preload="intent"
					search={{ offset: Number(data.nextOffset) }}
					className={buttonVariants({
						variant: "outline",
						className: cn(!data.nextOffset && "opacity-50 cursor-not-allowed"),
					})}
					disabled={!data.nextOffset}
				>
					Next
				</Link>
			</div>
		</div>
	);
}
