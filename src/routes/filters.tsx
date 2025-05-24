import {
	queryOptions,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useState } from "react";
import * as v from "valibot";
import { FilterForm, FilterSubmitContext } from "~/components/filter-form";
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
	getFilteredPokemonListQueryKey,
	getServerFilteredPokemonListQueryFn,
} from "~/util/pokemon";

const searchParamsSchema = v.object({
	offset: v.optional(v.number(), 0),
	name: v.optional(v.string(), ""),
});

function FilterSubmitContextProvider(props: {
	initialName: string;
	handleSubmit: (nameFilter: string) => void;
	children: React.ReactNode;
}) {
	const [nameFilter, setNameFilter] = useState(props.initialName);

	const handleSubmit = useCallback(() => {
		props.handleSubmit(nameFilter);
	}, [nameFilter, props]);

	return (
		<FilterSubmitContext.Provider
			value={{ handleSubmit, nameFilter, updateNameFilter: setNameFilter }}
		>
			{props.children}
		</FilterSubmitContext.Provider>
	);
}
export const Route = createFileRoute({
	validateSearch: searchParamsSchema,
	loaderDeps: ({ search }) => ({
		offset: search.offset,
		name: search.name,
	}),
	context: ({ deps }) => {
		const newKey = getFilteredPokemonListQueryKey(
			"filters",
			deps.offset,
			deps.name,
		);

		const pokemonListOptions = queryOptions({
			queryKey: newKey,
			queryFn: getServerFilteredPokemonListQueryFn,
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
	const navigate = Route.useNavigate();
	const { pokemonListOptions: serverPokemonListOptions } =
		Route.useRouteContext();
	const queryClient = useQueryClient();

	const { data } = useSuspenseQuery({
		...serverPokemonListOptions,
		queryFn: useServerFn(getServerFilteredPokemonListQueryFn),
	});

	if (data.prevOffset !== null) {
		void queryClient.prefetchQuery({
			...serverPokemonListOptions,
			queryKey: getFilteredPokemonListQueryKey(
				"filters",
				data.prevOffset,
				nameFilter,
			),
		});
	}

	if (data.nextOffset !== null) {
		void queryClient.prefetchQuery({
			...serverPokemonListOptions,
			queryKey: getFilteredPokemonListQueryKey(
				"filters",
				data.nextOffset,
				nameFilter,
			),
		});
	}

	// Use the filtered results directly from the server
	const filteredPokemon = data.pokemon;

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">
				National Pokédex: Pokémon {currentOffset + 1}-
				{currentOffset + POKEMON_LIMIT} (Filtered)
			</h1>

			{/* Filter UI */}
			<div className="mb-6 p-4 border rounded-lg bg-gray-50">
				<h2 className="text-lg font-semibold mb-3">Filters</h2>
				<FilterSubmitContextProvider
					key={`filter-submit-context-provider-${nameFilter}`}
					initialName={nameFilter}
					handleSubmit={(nameFilter) => {
						navigate({
							search: { name: nameFilter },
						});
					}}
				>
					<FilterForm />
				</FilterSubmitContextProvider>
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
