CREATE TABLE `pokemon` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`dex_id` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pokemon_types` (
	`id` integer PRIMARY KEY NOT NULL,
	`pokemon_id` integer NOT NULL,
	`type_id` integer NOT NULL,
	FOREIGN KEY (`pokemon_id`) REFERENCES `pokemon`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`type_id`) REFERENCES `types`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_pt_pokemon` ON `pokemon_types` (`pokemon_id`);--> statement-breakpoint
CREATE INDEX `idx_pt_type` ON `pokemon_types` (`type_id`);--> statement-breakpoint
CREATE TABLE `types` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
