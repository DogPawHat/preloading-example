import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import netlify from "@netlify/vite-plugin-tanstack-start";

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
  plugins: [
    tanstackStart({
      rsc: {
        enabled: true,
      },
    }),
    netlify(),
    react(),
    rsc(),
    tailwindcss(),
  ],
});
