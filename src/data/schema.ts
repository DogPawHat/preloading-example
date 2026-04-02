import { sqliteTable, index, integer, text } from "drizzle-orm/sqlite-core";

export const pokemon = sqliteTable("pokemon", {
  id: integer().primaryKey(),
  name: text().notNull(),
  dexId: integer("dex_id").notNull(),
});

export const pokemonTypes = sqliteTable(
  "pokemon_types",
  {
    id: integer().primaryKey(),
    pokemonId: integer("pokemon_id")
      .notNull()
      .references(() => pokemon.id),
    typeId: integer("type_id")
      .notNull()
      .references(() => types.id),
  },
  (table) => [index("idx_pt_type").on(table.typeId), index("idx_pt_pokemon").on(table.pokemonId)],
);

export const types = sqliteTable("types", {
  id: integer().primaryKey(),
  name: text().notNull(),
});
