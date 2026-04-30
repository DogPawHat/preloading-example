import { POKEMON_LIMIT } from "~/demos/pokemon-listing/constants";

export type PokemonListingRow = {
  id: number;
  name: string;
  types: Array<{ name: string }>;
};

type PokemonListingSourceRow = {
  id: number;
  name: string;
  types: Array<{ name: string }>;
};

export type PokemonListingResult = {
  pokemon: PokemonListingRow[];
  nextOffset: number | null;
  prevOffset: number | null;
  appliedFilter?: string;
};

export const normalizePokemonNameFilter = (nameFilter: string) => {
  return nameFilter.trim();
};

export const getPokemonListingQueryLimit = () => {
  return POKEMON_LIMIT + 1;
};

export const toPokemonListing = (
  rows: PokemonListingSourceRow[],
  options: { offset: number; nameFilter?: string },
): PokemonListingResult => {
  const hasMore = rows.length > POKEMON_LIMIT;
  const pageRows = hasMore ? rows.slice(0, POKEMON_LIMIT) : rows;
  const appliedFilter =
    options.nameFilter === undefined ? undefined : normalizePokemonNameFilter(options.nameFilter);

  return {
    pokemon: pageRows.map((pokemon) => ({
      id: pokemon.id,
      name: pokemon.name,
      types: pokemon.types.map((type) => ({ name: type.name })),
    })),
    nextOffset: hasMore ? options.offset + POKEMON_LIMIT : null,
    prevOffset: options.offset > 0 ? Math.max(0, options.offset - POKEMON_LIMIT) : null,
    ...(appliedFilter === undefined ? {} : { appliedFilter }),
  };
};
