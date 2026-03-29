import pg from "pg";
import { config } from "../config.js";

export const sandboxPool = new pg.Pool({
  ...config.sandboxDb,
  statement_timeout: 5000,
  max: 5,
});

export async function executeSandboxSql(sql: string) {
  const client = await sandboxPool.connect();
  try {
    const result = await client.query(sql);
    return {
      rows: result.rows,
      fields: result.fields?.map((f) => f.name) ?? [],
      rowCount: result.rowCount,
      command: result.command,
    };
  } finally {
    client.release();
  }
}

export async function resetSandbox() {
  const client = await sandboxPool.connect();
  try {
    await client.query(`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
      END $$;
    `);
  } finally {
    client.release();
  }
}
