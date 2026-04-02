import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { varlockVitePlugin } from "@varlock/vite-integration";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  resolve: {
    tsconfigPaths: true,
  },
  fmt: {
    ignorePatterns: ["src/routeTree.gen.ts"],
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  server: {
    port: 3000,
  },
  plugins: [varlockVitePlugin(), tanstackStart({}), react(), tailwindcss()],
});
