import { mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { pokemon, pokemonTypes, types } from "./schema";
import * as schema from "./schema";

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
const dbPath = resolve(currentDir, "../../db/pokemon-with-types.db");
const seedDataPath = resolve(currentDir, "./seed-data.json");

const seedData = JSON.parse(readFileSync(seedDataPath, "utf8")) as SeedData;

rmSync(dbPath, { force: true });
mkdirSync(dirname(dbPath), { recursive: true });

const client = createClient({ url: `file:${dbPath}` });
const db = drizzle({ client, schema });

const schemaStatements = [
  `CREATE TABLE "pokemon" (
    "id" integer PRIMARY KEY NOT NULL,
    "name" text NOT NULL,
    "dex_id" integer NOT NULL
  )`,
  `CREATE TABLE "types" (
    "id" integer PRIMARY KEY NOT NULL,
    "name" text NOT NULL
  )`,
  `CREATE TABLE "pokemon_types" (
    "id" integer PRIMARY KEY NOT NULL,
    "pokemon_id" integer NOT NULL REFERENCES "pokemon"("id"),
    "type_id" integer NOT NULL REFERENCES "types"("id")
  )`,
  `CREATE INDEX "idx_pt_pokemon" ON "pokemon_types" ("pokemon_id")`,
  `CREATE INDEX "idx_pt_type" ON "pokemon_types" ("type_id")`,
];

for (const statement of schemaStatements) {
  await client.execute(statement);
}

const BATCH_SIZE = 500;

for (let index = 0; index < seedData.pokemon.length; index += BATCH_SIZE) {
  await db.insert(pokemon).values(seedData.pokemon.slice(index, index + BATCH_SIZE));
}

await db.insert(types).values(seedData.types);

for (let index = 0; index < seedData.pokemonTypes.length; index += BATCH_SIZE) {
  await db.insert(pokemonTypes).values(seedData.pokemonTypes.slice(index, index + BATCH_SIZE));
}

console.log(
  `Seeded: ${seedData.pokemon.length} pokemon, ${seedData.types.length} types, ${seedData.pokemonTypes.length} pokemon_types`,
);

client.close();
