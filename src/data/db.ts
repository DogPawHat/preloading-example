import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "~/env.js";
import { relations } from "./relations.js";

const client = postgres(env.DATABASE_URL, { prepare: false });
const db = drizzle({
  client,
  relations,
});

export const DB = {
  queries: {
    getPokemonAtOffset: async (offset: number, limit: number) => {
      return db.query.pokemon.findMany({
        columns: {
          id: true,
          name: true,
          dexId: true,
        },
        orderBy: {
          dexId: "asc",
        },
        limit,
        offset,
        with: {
          types: {
            columns: {
              name: true,
            },
          },
        },
      });
    },
    getFilteredPokemonAtOffset: async (offset: number, limit: number, nameFilter: string) => {
      // Convert the filter to a SQL LIKE pattern (case-insensitive)
      const likePattern = `%${nameFilter.toLowerCase()}%`;
      return db.query.pokemon.findMany({
        columns: {
          id: true,
          name: true,
          dexId: true,
        },
        where: {
          RAW: (pokemon, { sql }) => sql`lower(${pokemon.name}) like lower(${likePattern})`,
        },
        orderBy: {
          dexId: "asc",
        },
        limit,
        offset,
        with: {
          types: {
            columns: {
              name: true,
            },
          },
        },
      });
    },
  },
};
