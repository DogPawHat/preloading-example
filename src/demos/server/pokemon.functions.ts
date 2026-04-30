import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import { DB } from "~/data/db";
import {
  getPokemonListingQueryLimit,
  normalizePokemonNameFilter,
  toPokemonListing,
} from "~/demos/pokemon-listing/pokemon-listing";

const PokemonListParamsSchema = v.object({
  offset: v.optional(v.number()),
});

const FilteredPokemonListParamsSchema = v.object({
  offset: v.optional(v.number()),
  nameFilter: v.optional(v.string()),
});

const innerGetPokemonList = async (offset: number) => {
  const pokemon = await DB.queries.getPokemonAtOffset(offset, getPokemonListingQueryLimit());

  return toPokemonListing(pokemon, { offset });
};

const innerGetFilteredPokemonList = async (offset: number, nameFilter: string) => {
  const appliedFilter = normalizePokemonNameFilter(nameFilter);

  if (!appliedFilter) {
    return await innerGetPokemonList(offset);
  }

  const pokemon = await DB.queries.getFilteredPokemonAtOffset(
    offset,
    getPokemonListingQueryLimit(),
    appliedFilter,
  );

  return toPokemonListing(pokemon, { offset, nameFilter: appliedFilter });
};

export const getServerPokemonList = createServerFn({ method: "GET" })
  .inputValidator((params) => {
    const validated = v.parse(PokemonListParamsSchema, params);
    const offset = validated.offset ?? 0;

    if (offset < 0) throw new Error("Offset must be greater than or equal to 0");

    return { offset };
  })
  .handler(async ({ data }) => {
    return await innerGetPokemonList(data.offset);
  });

export const getServerFilteredPokemonList = createServerFn({ method: "GET" })
  .inputValidator((params) => {
    const validated = v.parse(FilteredPokemonListParamsSchema, params);
    const offset = validated.offset ?? 0;
    const nameFilter = validated.nameFilter ?? "";

    if (offset < 0) throw new Error("Offset must be greater than or equal to 0");

    return { offset, nameFilter };
  })
  .handler(async ({ data }) => {
    return await innerGetFilteredPokemonList(data.offset, data.nameFilter);
  });
