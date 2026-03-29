import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    host: process.env.POSTGRES_HOST ?? "localhost",
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    user: process.env.POSTGRES_USER ?? "dml_admin",
    password: process.env.POSTGRES_PASSWORD ?? "change_me_in_production",
    database: process.env.APP_DB_NAME ?? "dml_app",
  },
});
