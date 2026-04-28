import { pgTable, index, integer, text } from "drizzle-orm/pg-core";
import { createSelectSchema } from "drizzle-orm/valibot";

export const pokemon = pgTable("pokemon", {
  id: integer().primaryKey(),
  name: text().notNull(),
  dexId: integer("dex_id").notNull(),
});

export const pokemonSelectSchema = createSelectSchema(pokemon);

export const pokemonTypes = pgTable(
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

export const pokemonTypesSelectSchema = createSelectSchema(pokemonTypes);

export const types = pgTable("types", {
  id: integer().primaryKey(),
  name: text().notNull(),
});

export const typesSelectSchema = createSelectSchema(types);
