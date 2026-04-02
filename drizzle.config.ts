import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";
import { ENV } from "varlock/env";

config({ path: ".env.local" });

export default defineConfig({
  out: "./drizzle",
  schema: "./src/data/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: ENV.TURSO_DATABASE_URL,
    authToken: ENV.TURSO_AUTH_TOKEN,
  },
});
