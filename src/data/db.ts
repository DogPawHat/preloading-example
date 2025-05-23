import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const db = drizzle("file:./local.db", { schema });

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

export const DB = {
	queries: {
		getPokemonAtOffset: async (offset: number, limit: number) => {
			return preparedGetPokemonAtOffset.execute({
				limit,
				offset,
			});
		},
	},
};
