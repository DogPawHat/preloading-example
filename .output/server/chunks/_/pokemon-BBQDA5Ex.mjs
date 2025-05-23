import * as v from 'valibot';
import { z as createServerRpc, A as createServerFn, D as DB } from './ssr.mjs';
import 'react/jsx-runtime';
import 'react';
import 'react-dom';
import 'drizzle-orm';
import 'drizzle-orm/libsql';
import '@t3-oss/env-core';
import 'drizzle-orm/sqlite-core';
import 'node:async_hooks';
import 'node:stream';
import 'react-dom/server';
import 'node:stream/web';

const PokemonListParamsSchema = v.object({
  offset: v.optional(v.number())
});
const innerGetPokemonList = async (offset) => {
  const pokemon = await DB.queries.getPokemonAtOffset(offset, POKEMON_LIMIT + 1);
  const hasMore = pokemon.length > POKEMON_LIMIT;
  const results = hasMore ? pokemon.slice(0, -1) : pokemon;
  console.log("results", results);
  return {
    pokemon: results,
    nextOffset: hasMore ? offset + POKEMON_LIMIT : null,
    prevOffset: offset > 0 ? Math.max(0, offset - POKEMON_LIMIT) : null
  };
};
const getServerPokemonList_createServerFn_handler = createServerRpc("src_util_pokemon_ts--getServerPokemonList_createServerFn_handler", "/_serverFn", (opts, signal) => {
  return getServerPokemonList.__executeServer(opts, signal);
});
const POKEMON_LIMIT = 25;
const getServerPokemonList = createServerFn({
  method: "GET"
}).validator((params) => {
  var _a;
  const validated = v.parse(PokemonListParamsSchema, params);
  const offset = (_a = validated.offset) != null ? _a : 0;
  if (offset < 0) throw new Error("Offset must be greater than or equal to 0");
  return {
    offset
  };
}).handler(getServerPokemonList_createServerFn_handler, async ({
  data
}) => {
  return await innerGetPokemonList(data.offset);
});

export { getServerPokemonList_createServerFn_handler };
//# sourceMappingURL=pokemon-BBQDA5Ex.mjs.map
