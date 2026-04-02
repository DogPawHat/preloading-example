import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { ENV } from "varlock/env";
import * as schema from "~/data/schema.js";

const db = drizzle({
  connection: {
    url: ENV.TURSO_DATABASE_URL,
    authToken: ENV.TURSO_AUTH_TOKEN,
  },
  schema,
});

const preparedGetPokemonAtOffset = db.query.pokemon
  .findMany({
    columns: {
      id: true,
      name: true,
      dexId: true,
    },
    orderBy: (pokemon, { asc }) => [asc(pokemon.dexId)],
    limit: sql.placeholder("limit"),
    offset: sql.placeholder("offset"),
    with: {
      types: {
        orderBy: (types, { asc }) => [asc(types.typeId)],
        columns: {},
        with: {
          type: {
            columns: {
              name: true,
            },
          },
        },
      },
    },
  })
  .prepare();

const preparedGetFilteredPokemonAtOffset = db.query.pokemon
  .findMany({
    columns: {
      id: true,
      name: true,
      dexId: true,
    },
    where: (pokemon, { sql }) =>
      sql`lower(${pokemon.name}) like lower(${sql.placeholder("nameFilter")})`,
    orderBy: (pokemon, { asc }) => [asc(pokemon.dexId)],
    limit: sql.placeholder("limit"),
    offset: sql.placeholder("offset"),
    with: {
      types: {
        orderBy: (types, { asc }) => [asc(types.typeId)],
        columns: {},
        with: {
          type: {
            columns: {
              name: true,
            },
          },
        },
      },
    },
  })
  .prepare();

export const DB = {
  queries: {
    getPokemonAtOffset: async (offset: number, limit: number) => {
      return preparedGetPokemonAtOffset.execute({
        limit,
        offset,
      });
    },
    getFilteredPokemonAtOffset: async (offset: number, limit: number, nameFilter: string) => {
      // Convert the filter to a SQL LIKE pattern (case-insensitive)
      const likePattern = `%${nameFilter.toLowerCase()}%`;
      return preparedGetFilteredPokemonAtOffset.execute({
        limit,
        offset,
        nameFilter: likePattern,
      });
    },
  },
};
