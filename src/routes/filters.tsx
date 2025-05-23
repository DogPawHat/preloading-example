import {
	queryOptions,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import { PaginationNav } from "~/components/pagination-nav";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
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
	name: v.optional(v.string(), ""),
});

export const Route = createFileRoute({
	validateSearch: searchParamsSchema,
	loaderDeps: ({ search }) => ({
		offset: search.offset,
		name: search.name,
	}),
	context: ({ deps }) => {
		const newKey = getPokemonListQueryKey("filters", deps.offset);

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
	const { offset: currentOffset, name: nameFilter } = Route.useSearch();
	const { pokemonListOptions: serverPokemonListOptions } =
		Route.useRouteContext();
	const queryClient = useQueryClient();

	const { data } = useSuspenseQuery({
		...serverPokemonListOptions,
		queryFn: useServerFn(getServerPokemonListQueryFn),
	});

	if (data.prevOffset !== null) {
		void queryClient.prefetchQuery({
			...serverPokemonListOptions,
			queryKey: getPokemonListQueryKey("filters", data.prevOffset),
		});
	}

	if (data.nextOffset !== null) {
		void queryClient.prefetchQuery({
			...serverPokemonListOptions,
			queryKey: getPokemonListQueryKey("filters", data.nextOffset),
		});
	}

	// Filter Pokemon by name (dummy implementation for now)
	const filteredPokemon = data.pokemon.filter((pokemon) =>
		pokemon.name.toLowerCase().includes(nameFilter.toLowerCase()),
	);

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">
				National Pokédex: Pokémon {currentOffset + 1}-
				{currentOffset + POKEMON_LIMIT} (Filtered)
			</h1>

			{/* Filter UI */}
			<div className="mb-6 p-4 border rounded-lg bg-gray-50">
				<h2 className="text-lg font-semibold mb-3">Filters</h2>
				<div className="space-y-4">
					<div>
						<Label htmlFor="name-filter" className="text-sm font-medium">
							Filter by Name
						</Label>
						<Input
							id="name-filter"
							type="text"
							placeholder="Enter Pokemon name..."
							value={nameFilter}
							onChange={(e) => {
								// This is dummy UI - in a real implementation, this would update the URL search params
								console.log("Filter changed:", e.target.value);
							}}
							className="mt-1"
						/>
						<p className="text-xs text-gray-500 mt-1">
							Current filter: "{nameFilter}" (dummy UI - not functional yet)
						</p>
					</div>
				</div>
			</div>

			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>#</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Details</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredPokemon.map((pokemon) => (
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

			{filteredPokemon.length === 0 && nameFilter && (
				<div className="text-center py-8 text-gray-500">
					No Pokemon found matching "{nameFilter}"
				</div>
			)}

			<PaginationNav
				prevOffset={data.prevOffset ?? undefined}
				nextOffset={data.nextOffset ?? undefined}
				to="/filters"
			/>
		</div>
	);
}
