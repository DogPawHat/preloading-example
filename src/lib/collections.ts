import { BasicIndex, createCollection } from "@tanstack/react-db";
import { electricCollectionOptions } from "@tanstack/electric-db-collection";

import { pokemonSelectSchema, typesSelectSchema, pokemonTypesSelectSchema } from "~/data/schema";

export const pokemonCollection = createCollection(
  electricCollectionOptions({
    shapeOptions: {
      url: "http://localhost:3000/api/shapes/pokemon",
    },
    getKey: (item) => item.id,
    schema: pokemonSelectSchema,
  }),
);
pokemonCollection.createIndex((row) => row.id, { indexType: BasicIndex });
pokemonCollection.createIndex((row) => row.dexId, { indexType: BasicIndex });

export const typesCollection = createCollection(
  electricCollectionOptions({
    shapeOptions: {
      url: "http://localhost:3000/api/shapes/types",
    },
    getKey: (item) => item.id,
    schema: typesSelectSchema,
  }),
);
typesCollection.createIndex((row) => row.id, { indexType: BasicIndex });

export const pokemonTypesCollection = createCollection(
  electricCollectionOptions({
    shapeOptions: {
      url: "http://localhost:3000/api/shapes/pokemon-types",
    },
    getKey: (item) => item.id,
    schema: pokemonTypesSelectSchema,
  }),
);
pokemonTypesCollection.createIndex((row) => row.id, { indexType: BasicIndex });
pokemonTypesCollection.createIndex((row) => row.pokemonId, { indexType: BasicIndex });
pokemonTypesCollection.createIndex((row) => row.typeId, { indexType: BasicIndex });
