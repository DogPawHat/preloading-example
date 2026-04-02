import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "~env";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.js";

type SeedData = {
  pokemon: Array<{
    id: number;
    name: string;
    dexId: number;
  }>;
  types: Array<{
    id: number;
    name: string;
  }>;
  pokemonTypes: Array<{
    id: number;
    pokemonId: number;
    typeId: number;
  }>;
};

const currentDir = dirname(fileURLToPath(import.meta.url));
const seedDataPath = resolve(currentDir, "./seed-data.json");

const seedData = JSON.parse(readFileSync(seedDataPath, "utf8")) as SeedData;

const db = drizzle({
  connection: {
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
  schema,
});

const BATCH_SIZE = 500;

await db.delete(schema.pokemon);
await db.delete(schema.types);
await db.delete(schema.pokemonTypes);

for (let index = 0; index < seedData.pokemon.length; index += BATCH_SIZE) {
  await db.insert(schema.pokemon).values(seedData.pokemon.slice(index, index + BATCH_SIZE));
}

await db.insert(schema.types).values(seedData.types);

for (let index = 0; index < seedData.pokemonTypes.length; index += BATCH_SIZE) {
  await db
    .insert(schema.pokemonTypes)
    .values(seedData.pokemonTypes.slice(index, index + BATCH_SIZE));
}

console.log(
  `Seeded: ${seedData.pokemon.length} pokemon, ${seedData.types.length} types, ${seedData.pokemonTypes.length} pokemon_types`,
);
