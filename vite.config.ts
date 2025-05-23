import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default defineConfig({
	server: {
		port: 3000,
	},
	plugins: [
		viteTsconfigPaths({
			projects: ["./tsconfig.json"],
		}),
		tailwindcss(),
		tanstackStart({}),
	],
});
