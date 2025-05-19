import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
	server: {
		port: 3000,
	},
	plugins: [tailwindcss(), tanstackStart({})],
	test: {
		globals: true,
		environment: "jsdom",
	},
	base: "/",
	resolve: {
		alias: {
			"~": path.resolve(__dirname, "./src"),
		},
	},
});
