CREATE TABLE "pokemon" (
	"id" integer PRIMARY KEY,
	"name" text NOT NULL,
	"dex_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pokemon_types" (
	"id" integer PRIMARY KEY,
	"pokemon_id" integer NOT NULL,
	"type_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "types" (
	"id" integer PRIMARY KEY,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_pt_type" ON "pokemon_types" ("type_id");--> statement-breakpoint
CREATE INDEX "idx_pt_pokemon" ON "pokemon_types" ("pokemon_id");--> statement-breakpoint
ALTER TABLE "pokemon_types" ADD CONSTRAINT "pokemon_types_pokemon_id_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "pokemon"("id");--> statement-breakpoint
ALTER TABLE "pokemon_types" ADD CONSTRAINT "pokemon_types_type_id_types_id_fkey" FOREIGN KEY ("type_id") REFERENCES "types"("id");