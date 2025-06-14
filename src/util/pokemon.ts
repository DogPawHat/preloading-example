import type { QueryFunctionContext } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import { DB } from "~/data/db";

export const POKEMON_LIMIT = 10;

const PokemonListParamsSchema = v.object({
	offset: v.optional(v.number()),
});

const FilteredPokemonListParamsSchema = v.object({
	offset: v.optional(v.number()),
	nameFilter: v.optional(v.string()),
});

const innerGetPokemonList = async (offset: number) => {
	// Fetch one extra item to check if there are more results
	const pokemon = await DB.queries.getPokemonAtOffset(
		offset,
		POKEMON_LIMIT + 1,
	);

	// Check if there are more results by looking at the extra item
	const hasMore = pokemon.length > POKEMON_LIMIT;

	// Remove the extra item if it exists
	const results = hasMore ? pokemon.slice(0, -1) : pokemon;

	console.log("results", results);

	return {
		pokemon: results,
		nextOffset: hasMore ? offset + POKEMON_LIMIT : null,
		prevOffset: offset > 0 ? Math.max(0, offset - POKEMON_LIMIT) : null,
	};
};

const innerGetFilteredPokemonList = async (
	offset: number,
	nameFilter: string,
) => {
	// If no filter is provided, fall back to regular query
	if (!nameFilter.trim()) {
		return await innerGetPokemonList(offset);
	}

	// Fetch one extra item to check if there are more results
	const pokemon = await DB.queries.getFilteredPokemonAtOffset(
		offset,
		POKEMON_LIMIT + 1,
		`%${nameFilter.trim()}%`,
	);

	// Check if there are more results by looking at the extra item
	const hasMore = pokemon.length > POKEMON_LIMIT;

	// Remove the extra item if it exists
	const results = hasMore ? pokemon.slice(0, -1) : pokemon;

	console.log("filtered results", results, "filter:", nameFilter);

	return {
		pokemon: results,
		nextOffset: hasMore ? offset + POKEMON_LIMIT : null,
		prevOffset: offset > 0 ? Math.max(0, offset - POKEMON_LIMIT) : null,
		appliedFilter: nameFilter.trim(),
	};
};

const getServerPokemonList = createServerFn({ method: "GET" })
	.validator((params) => {
		const validated = v.parse(PokemonListParamsSchema, params);
		const offset = validated.offset ?? 0;

		if (offset < 0)
			throw new Error("Offset must be greater than or equal to 0");

		return { offset };
	})
	.handler(async ({ data }) => {
		return await innerGetPokemonList(data.offset);
	});

const getServerFilteredPokemonList = createServerFn({ method: "GET" })
	.validator((params) => {
		const validated = v.parse(FilteredPokemonListParamsSchema, params);
		const offset = validated.offset ?? 0;
		const nameFilter = validated.nameFilter ?? "";

		if (offset < 0)
			throw new Error("Offset must be greater than or equal to 0");

		return { offset, nameFilter };
	})
	.handler(async ({ data }) => {
		return await innerGetFilteredPokemonList(data.offset, data.nameFilter);
	});

export const getPokemonListQueryKey = (location: string, offset: number) => {
	return ["pokemon-list", location, { offset }] as const;
};

export const getFilteredPokemonListQueryKey = (
	location: string,
	offset: number,
	nameFilter: string,
) => {
	return ["pokemon-list", location, { offset, nameFilter }] as const;
};

export const getServerPokemonListQueryFn = ({
	queryKey,
}: QueryFunctionContext<ReturnType<typeof getPokemonListQueryKey>>) => {
	const { offset } = queryKey[2];
	return getServerPokemonList({ data: { offset } });
};

export const getServerFilteredPokemonListQueryFn = ({
	queryKey,
}: QueryFunctionContext<ReturnType<typeof getFilteredPokemonListQueryKey>>) => {
	const { offset, nameFilter } = queryKey[2];
	return getServerFilteredPokemonList({ data: { offset, nameFilter } });
};
