import { defineConfig } from "drizzle-kit";
import { env } from "./env.js";

export default defineConfig({
  schema: "./src/data/schema.ts",
  out: "./migrations",
  dialect: "turso",
  dbCredentials: {
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
});
