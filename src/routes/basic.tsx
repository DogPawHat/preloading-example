import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "~/components/ui/table";
import { $pokeApiClient } from "../data/client";
import { useMemo, useState } from "react";

const POKEMON_LIMIT = 20;

const matchPokemonIdExp = /\/api\/v2\/pokemon\/(\d+)\/?/;

export const Route = createFileRoute("/basic")({
	component: RouteComponent,
});

interface PokemonListResult {
	name: string;
	url: string;
}

function RouteComponent() {  

	const [currentOffset, setCurrentOffset] = useState<number | undefined>(undefined);
	const { data, error } = useQuery(
		$pokeApiClient.queryOptions("get", "/api/v2/pokemon/", {
			params: {
				query: {
					limit: POKEMON_LIMIT,
					offset: currentOffset ?? undefined,
				},
			},
		}),
	);

	const previousOffset = useMemo(() => {
		if(data?.previous == null) {
			return null;
		}  

		return new URL(data.previous).searchParams.get("offset") ?? null;
	}, [data?.previous]);

	const nextOffset = useMemo(() => {
		if(data?.next == null) {
			return null;
		}

		return new URL(data.next).searchParams.get("offset") ?? null;
	}, [data?.next]);

	if (data) {
		const results = data.results ?? [];
		return (
			<div className="p-4">
				<h1 className="text-2xl font-bold mb-4">
					National Pokédex: Pokémon {currentOffset + 1}-{currentOffset + POKEMON_LIMIT}
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
						{results.map((pokemon: PokemonListResult, idx: number) => (
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
					<button 
						type="button"
						onClick={() => setCurrentOffset(previousOffset ? parseInt(previousOffset) : undefined)}
						disabled={!previousOffset}
						className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Previous
					</button>
					<button
						type="button"
						onClick={() => setCurrentOffset(nextOffset ? parseInt(nextOffset) : undefined)}
						disabled={!nextOffset}
						className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Next
					</button>
				</div>
			</div>
		);
	}

	if (error) return <div>Error loading Pokémon.</div>;

	return <div>No data</div>;
}
