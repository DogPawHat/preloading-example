import { defineConfig } from "drizzle-kit";
import { env } from "./src/env.js";

export default defineConfig({
  schema: "./src/data/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
