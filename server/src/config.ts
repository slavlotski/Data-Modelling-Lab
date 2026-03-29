export const config = {
  port: Number(process.env.SERVER_PORT ?? 3001),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",

  appDb: {
    host: process.env.POSTGRES_HOST ?? "localhost",
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    user: process.env.POSTGRES_USER ?? "dml_admin",
    password: process.env.POSTGRES_PASSWORD ?? "change_me_in_production",
    database: process.env.APP_DB_NAME ?? "dml_app",
  },

  sandboxDb: {
    host: process.env.POSTGRES_HOST ?? "localhost",
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    user: process.env.POSTGRES_USER ?? "dml_admin",
    password: process.env.POSTGRES_PASSWORD ?? "change_me_in_production",
    database: process.env.SANDBOX_DB_NAME ?? "dml_sandbox",
  },

  contentDir: process.env.CONTENT_DIR ?? "../content",
} as const;
