import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "~env";
import { relations } from "./relations.js";

const db = drizzle({
  connection: {
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
  relations,
});

const preparedGetPokemonAtOffset = db.query.pokemon
  .findMany({
    columns: {
      id: true,
      name: true,
      dexId: true,
    },
    orderBy: {
      dexId: "asc",
    },
    limit: sql.placeholder("limit"),
    offset: sql.placeholder("offset"),
    with: {
      types: {
        columns: {
          name: true,
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
    where: {
      RAW: (pokemon, { sql }) =>
        sql`lower(${pokemon.name}) like lower(${sql.placeholder("nameFilter")})`,
    },
    orderBy: {
      dexId: "asc",
    },
    limit: sql.placeholder("limit"),
    offset: sql.placeholder("offset"),
    with: {
      types: {
        columns: {
          name: true,
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
