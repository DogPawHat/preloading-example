import type { QueryFunctionContext } from "@tanstack/react-query";
import { getServerPokemonList, getServerFilteredPokemonList } from "~/server/pokemon";

export const POKEMON_LIMIT = 10;

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

export const getPokemonListQueryFn = async ({
  queryKey,
}: QueryFunctionContext<ReturnType<typeof getPokemonListQueryKey>>) => {
  const { offset } = queryKey[2];
  return getServerPokemonList({ data: { offset } });
};

export const getFilteredPokemonListQueryFn = async ({
  queryKey,
}: QueryFunctionContext<ReturnType<typeof getFilteredPokemonListQueryKey>>) => {
  const { offset, nameFilter } = queryKey[2];
  return getServerFilteredPokemonList({ data: { offset, nameFilter } });
};
