import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import { DB } from "~/data/db";

export const POKEMON_LIMIT = 25;

const PokemonListParamsSchema = v.object({
	offset: v.optional(v.number()),
});

export const getPokemonList = createServerFn({ method: "GET" })
	.validator((params) => {
		const validated = v.parse(PokemonListParamsSchema, params);
		const offset = validated.offset ?? 0;

		if (offset < 0)
			throw new Error("Offset must be greater than or equal to 0");

		return { offset };
	})
	.handler(async ({ data }) => {
		const { offset } = data;

		// Fetch one extra item to check if there are more results
		const pokemon = await DB.queries.getPokemonAtOffset(
			offset,
			POKEMON_LIMIT + 1,
		);

		// Check if there are more results by looking at the extra item
		const hasMore = pokemon.length > POKEMON_LIMIT;

		// Remove the extra item if it exists
		const results = hasMore ? pokemon.slice(0, -1) : pokemon;

		return {
			pokemon: results,
			nextOffset: hasMore ? offset + POKEMON_LIMIT : null,
			prevOffset: offset > 0 ? Math.max(0, offset - POKEMON_LIMIT) : null,
		};
	});
