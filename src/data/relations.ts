import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  types: {
    pokemon: r.many.pokemon({
      from: r.types.id.through(r.pokemonTypes.typeId),
      to: r.pokemon.id.through(r.pokemonTypes.pokemonId),
    }),
  },
  pokemon: {
    types: r.many.types(),
  },
}));
