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

export const Route = createFileRoute("/basic")({
	component: RouteComponent,
});

interface PokemonListResult {
	name: string;
	url: string;
}

function RouteComponent() {
	const { data, error } = useQuery(
		$pokeApiClient.queryOptions("get", "/api/v2/pokemon/"),
	);

	if (data) {
		const results = data.results ?? [];
		return (
			<div className="p-4">
				<h1 className="text-2xl font-bold mb-4">
					National Pokédex: Pokémon 1-50
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
								<TableCell>{idx + 1}</TableCell>
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
			</div>
		);
	}

	if (error) return <div>Error loading Pokémon.</div>;

	return <div>No data</div>;
}
