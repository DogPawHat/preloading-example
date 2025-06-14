import { useDebouncedCallback } from "@tanstack/react-pacer";
import {
	queryOptions,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useCallback } from "react";
import { useState } from "react";
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

export const Route = createFileRoute({
	validateSearch: searchParamsSchema,
	loaderDeps: ({ search }) => ({
		offset: search.offset,
		name: search.name,
	}),
	context: ({ deps }) => {
		const newKey = getFilteredPokemonListQueryKey(
			"debounced-preload-filters",
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

// And we have debounced preloading
function PreloadFilterSubmitContextProvider(props: {
	initialName: string;
	handleSubmit: (nameFilter: string) => void;
	children: React.ReactNode;
}) {
	const queryClient = useQueryClient();
	const { pokemonListOptions: serverPokemonListOptions } =
		Route.useRouteContext();
	const [nameFilter, setNameFilter] = useState(props.initialName);
	const getFilteredPokemonListQueryFn = useServerFn(
		getServerFilteredPokemonListQueryFn,
	);

	const debouncedNameFilter = useDebouncedCallback(
		(newNameFilter: string) => {
			void queryClient.prefetchQuery({
				queryKey: getFilteredPokemonListQueryKey(
					serverPokemonListOptions.queryKey[1],
					serverPokemonListOptions.queryKey[2].offset,
					newNameFilter,
				),
				queryFn: getFilteredPokemonListQueryFn,
			});
		},
		{
			wait: 100,
		},
	);

	const updateNameFilter = useCallback(
		(value: string) => {
			debouncedNameFilter(value);
			setNameFilter(value);
		},
		[debouncedNameFilter],
	);

	const handleSubmit = useCallback(() => {
		props.handleSubmit(nameFilter);
	}, [nameFilter, props]);

	return (
		<FilterSubmitContext.Provider
			value={{ handleSubmit, nameFilter, updateNameFilter }}
		>
			{props.children}
		</FilterSubmitContext.Provider>
	);
}

function RouteComponent() {
	const { offset: currentOffset, name: nameFilter } = Route.useSearch();
	const navigate = Route.useNavigate();
	const { pokemonListOptions: serverPokemonListOptions } =
		Route.useRouteContext();
	const queryClient = useQueryClient();
	const getFilteredPokemonListQueryFn = useServerFn(
		getServerFilteredPokemonListQueryFn,
	);

	const { data } = useSuspenseQuery({
		...serverPokemonListOptions,
		queryFn: getFilteredPokemonListQueryFn,
	});

	if (data.prevOffset !== null) {
		void queryClient.prefetchQuery({
			...serverPokemonListOptions,
			queryFn: getFilteredPokemonListQueryFn,
		});
	}

	if (data.nextOffset !== null) {
		void queryClient.prefetchQuery({
			...serverPokemonListOptions,
			queryFn: getFilteredPokemonListQueryFn,
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
				<PreloadFilterSubmitContextProvider
					initialName={nameFilter}
					handleSubmit={(nameFilter) => {
						navigate({
							search: { name: nameFilter },
						});
					}}
				>
					<FilterForm />
				</PreloadFilterSubmitContextProvider>
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
				to="/debounced-preload-filters"
			/>
		</div>
	);
}
