import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { buttonVariants } from "~/components/ui/button";

import { useServerFn } from "@tanstack/react-start";
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
import { POKEMON_LIMIT, getServerPokemonList } from "~/util/pokemon";

const searchParamsSchema = v.object({
	offset: v.optional(v.number(), 0),
});

export const Route = createFileRoute({
	validateSearch: searchParamsSchema,
	component: RouteComponent,
});

function RouteComponent() {
	const getPokemonList = useServerFn(getServerPokemonList);
	const { offset: currentOffset } = Route.useSearch();

	const newKey = [
		"pokemon-list",
		"basic",
		{ limit: POKEMON_LIMIT, offset: currentOffset },
	] as const;

	const { data, error } = useQuery({
		queryKey: newKey,
		queryFn: async () => {
			return await getPokemonList({ data: { offset: currentOffset } });
		},
	});

	const previousOffset = useMemo(() => {
		if (data?.prevOffset == null) {
			return null;
		}

		return data.prevOffset.toString();
	}, [data?.prevOffset]);

	const nextOffset = useMemo(() => {
		if (data?.nextOffset == null) {
			return null;
		}

		return data.nextOffset.toString();
	}, [data?.nextOffset]);

	if (data) {
		const results = data.pokemon ?? [];
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
						{results.map((pokemon) => (
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
				<div className="flex justify-center gap-4 mt-4">
					<Link
						to="/basic"
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
						to="/basic"
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

	if (error) return <div>Error loading Pokémon.</div>;

	return <div>No data</div>;
}
