import { relations } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const pokemon = sqliteTable("pokemon", {
	id: integer("id").primaryKey(),
	name: text("name").notNull(),
	dexId: integer("dex_id").notNull(),
});

export const pokemonRelations = relations(pokemon, ({ many }) => ({
	types: many(pokemonTypes),
}));

export const types = sqliteTable("types", {
	id: integer("id").primaryKey(),
	name: text("name").notNull(),
});

export const typesRelations = relations(types, ({ many }) => ({
	pokemon: many(pokemonTypes),
}));

export const pokemonTypes = sqliteTable(
	"pokemon_types",
	{
		id: integer("id").primaryKey(),
		pokemonId: integer("pokemon_id")
			.notNull()
			.references(() => pokemon.id),
		typeId: integer("type_id")
			.notNull()
			.references(() => types.id),
	},
	(table) => [
		index("idx_pt_pokemon").on(table.pokemonId),
		index("idx_pt_type").on(table.typeId),
	],
);

export const pokemonTypesRelations = relations(pokemonTypes, ({ one }) => ({
	pokemon: one(pokemon, {
		fields: [pokemonTypes.pokemonId],
		references: [pokemon.id],
	}),
	type: one(types, {
		fields: [pokemonTypes.typeId],
		references: [types.id],
	}),
}));
