import { useSuspenseQuery } from "@tanstack/react-query";
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
	component: RouteComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent,
	pendingComponent: LoadingComponent,
});

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

	const newKey = [
		"pokemon-list",
		"suspense",
		{ limit: POKEMON_LIMIT, offset: currentOffset },
	] as const;

	const { data } = useSuspenseQuery({
		queryKey: newKey,
		queryFn: async () => {
			return await getServerPokemonList({
				data: { offset: currentOffset },
			});
		},
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
			<div className="flex justify-center gap-4 mt-4">
				<Link
					to="/suspense"
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
					to="/suspense"
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
