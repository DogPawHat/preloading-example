import { defineConfig } from "drizzle-kit";
import { env } from "./src/env/server";

export default defineConfig({
  out: './drizzle',
  schema: './src/data/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: env.DB_NAME,
  },
});
