import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import { PaginationNav } from "~/components/pagination-nav";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import {
	POKEMON_LIMIT,
	getPokemonListQueryKey,
	getServerPokemonListQueryFn,
} from "~/util/pokemon";

const searchParamsSchema = v.object({
	offset: v.optional(v.number(), 0),
});

export const Route = createFileRoute({
	validateSearch: searchParamsSchema,
	loaderDeps: ({ search }) => ({
		offset: search.offset,
	}),
	context: ({ deps }) => {
		const newKey = getPokemonListQueryKey("preloading", deps.offset);

		const pokemonListOptions = queryOptions({
			queryKey: newKey,
			queryFn: getServerPokemonListQueryFn,
		});

		return {
			pokemonListOptions,
		};
	},
	loader: ({ context }) => {
		context.queryClient.prefetchQuery(context.pokemonListOptions);
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { offset: currentOffset } = Route.useSearch();
	const { pokemonListOptions: serverPokemonListOptions } =
		Route.useRouteContext();

	const { data } = useSuspenseQuery({
		...serverPokemonListOptions,
		queryFn: useServerFn(getServerPokemonListQueryFn),
	});

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
									<span
										key={type.type.name}
										className="inline-block px-2 py-1 mr-1 text-sm font-medium rounded-full bg-gray-100"
									>
										{type.type.name}
									</span>
								))}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<PaginationNav
				prevOffset={data.prevOffset ?? undefined}
				nextOffset={data.nextOffset ?? undefined}
				to="/preloading"
			/>
		</div>
	);
}
