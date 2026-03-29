import { sandboxPool } from "../db/sandboxDb.js";

export interface ColumnInfo {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue: string | null;
}

export interface ConstraintInfo {
  name: string;
  type: "PRIMARY KEY" | "FOREIGN KEY" | "UNIQUE" | "CHECK";
  columns: string[];
  referencedTable?: string;
  referencedColumns?: string[];
  definition?: string;
}

export interface IndexInfo {
  name: string;
  columns: string[];
  unique: boolean;
  method: string;
}

export interface TableInfo {
  name: string;
  columns: ColumnInfo[];
  constraints: ConstraintInfo[];
  indexes: IndexInfo[];
}

export interface SchemaSnapshot {
  tables: TableInfo[];
}

export async function introspectSchema(): Promise<SchemaSnapshot> {
  const client = await sandboxPool.connect();
  try {
    // Get tables
    const tablesResult = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    const tables: TableInfo[] = [];

    for (const row of tablesResult.rows) {
      const tableName = row.table_name;

      // Get columns
      const colsResult = await client.query(
        `SELECT column_name, data_type, is_nullable, column_default
         FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = $1
         ORDER BY ordinal_position`,
        [tableName]
      );

      const columns: ColumnInfo[] = colsResult.rows.map((c) => ({
        name: c.column_name,
        type: c.data_type,
        nullable: c.is_nullable === "YES",
        defaultValue: c.column_default,
      }));

      // Get constraints
      const constraintsResult = await client.query(
        `SELECT
           tc.constraint_name,
           tc.constraint_type,
           kcu.column_name,
           ccu.table_name AS ref_table,
           ccu.column_name AS ref_column
         FROM information_schema.table_constraints tc
         JOIN information_schema.key_column_usage kcu
           ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
         LEFT JOIN information_schema.constraint_column_usage ccu
           ON tc.constraint_name = ccu.constraint_name AND tc.table_schema = ccu.table_schema
         WHERE tc.table_schema = 'public' AND tc.table_name = $1
         ORDER BY tc.constraint_name, kcu.ordinal_position`,
        [tableName]
      );

      const constraintMap = new Map<string, ConstraintInfo>();
      for (const c of constraintsResult.rows) {
        const existing = constraintMap.get(c.constraint_name);
        if (existing) {
          if (!existing.columns.includes(c.column_name)) {
            existing.columns.push(c.column_name);
          }
        } else {
          constraintMap.set(c.constraint_name, {
            name: c.constraint_name,
            type: c.constraint_type,
            columns: [c.column_name],
            ...(c.constraint_type === "FOREIGN KEY"
              ? { referencedTable: c.ref_table, referencedColumns: [c.ref_column] }
              : {}),
          });
        }
      }

      // Get check constraints
      const checksResult = await client.query(
        `SELECT con.conname, pg_get_constraintdef(con.oid) as definition
         FROM pg_constraint con
         JOIN pg_class rel ON rel.oid = con.conrelid
         JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
         WHERE nsp.nspname = 'public' AND rel.relname = $1 AND con.contype = 'c'`,
        [tableName]
      );

      for (const c of checksResult.rows) {
        constraintMap.set(c.conname, {
          name: c.conname,
          type: "CHECK",
          columns: [],
          definition: c.definition,
        });
      }

      // Get indexes
      const indexesResult = await client.query(
        `SELECT
           i.relname AS index_name,
           array_agg(a.attname ORDER BY k.n) AS columns,
           ix.indisunique AS is_unique,
           am.amname AS method
         FROM pg_index ix
         JOIN pg_class t ON t.oid = ix.indrelid
         JOIN pg_class i ON i.oid = ix.indexrelid
         JOIN pg_namespace n ON n.oid = t.relnamespace
         JOIN pg_am am ON am.oid = i.relam
         CROSS JOIN LATERAL unnest(ix.indkey) WITH ORDINALITY AS k(attnum, n)
         JOIN pg_attribute a ON a.attrelid = t.oid AND a.attnum = k.attnum
         WHERE n.nspname = 'public' AND t.relname = $1
         GROUP BY i.relname, ix.indisunique, am.amname`,
        [tableName]
      );

      const indexes: IndexInfo[] = indexesResult.rows.map((i) => ({
        name: i.index_name,
        columns: i.columns,
        unique: i.is_unique,
        method: i.method,
      }));

      tables.push({ name: tableName, columns, constraints: [...constraintMap.values()], indexes });
    }

    return { tables };
  } finally {
    client.release();
  }
}
