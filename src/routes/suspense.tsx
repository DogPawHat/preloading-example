import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
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
import { $pokeFetchClient } from "../data/client";

const POKEMON_LIMIT = 20;

const matchPokemonIdExp = /\/api\/v2\/pokemon\/(\d+)\/?/;

const searchParamsSchema = v.object({
	offset: v.optional(v.number(), 0),
});

export const Route = createFileRoute("/suspense")({
	validateSearch: searchParamsSchema,
	component: RouteComponent,
});

interface PokemonListResult {
	name: string;
	url: string;
}

function RouteComponent() {
	const { offset: currentOffset } = Route.useSearch();

	const newKey = [
		"pokemon-list",
		"suspense",
		{ limit: POKEMON_LIMIT, offset: currentOffset },
	] as const;

	const { data, error } = useQuery({
		queryKey: newKey,
		queryFn: async () => {
			const { data, error } = await $pokeFetchClient.GET("/api/v2/pokemon/", {
				params: {
					query: {
						limit: POKEMON_LIMIT,
						offset: currentOffset,
					},
				},
			});

			if (error) {
				throw error;
			}

			return data;
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

	if (data) {
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
								<TableCell>
									{pokemon.url.match(matchPokemonIdExp)?.[1]}
								</TableCell>
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
