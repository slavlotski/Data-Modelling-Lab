import { introspectSchema, type SchemaSnapshot } from "./introspectionService.js";
import { executeSandboxSql, resetSandbox } from "../db/sandboxDb.js";
import { tableExists } from "../validation/checks/tableExists.js";
import { columnCheck } from "../validation/checks/columnCheck.js";
import { primaryKeyCheck } from "../validation/checks/primaryKeyCheck.js";
import { foreignKeyCheck } from "../validation/checks/foreignKeyCheck.js";

export interface CheckResult {
  name: string;
  passed: boolean;
  message: string;
}

export interface ValidationResult {
  passed: boolean;
  checks: CheckResult[];
  error?: string;
}

export interface ExpectedSchema {
  tables: Array<{
    name: string;
    columns?: Array<{
      name: string;
      type?: string;
      nullable?: boolean;
    }>;
    primaryKey?: string[];
    foreignKeys?: Array<{
      columns: string[];
      referencedTable: string;
      referencedColumns: string[];
    }>;
  }>;
  checks?: string[];
}

const checkRegistry: Record<string, (actual: SchemaSnapshot, expected: ExpectedSchema) => CheckResult[]> = {
  tableExists,
  columnCheck,
  primaryKeyCheck,
  foreignKeyCheck,
};

export async function validateChallenge(
  userSql: string,
  expected: ExpectedSchema
): Promise<ValidationResult> {
  try {
    await resetSandbox();
    await executeSandboxSql(userSql);

    const actual = await introspectSchema();
    const checksToRun = expected.checks ?? ["tableExists", "columnCheck", "primaryKeyCheck", "foreignKeyCheck"];

    const results: CheckResult[] = [];
    for (const checkName of checksToRun) {
      const checkFn = checkRegistry[checkName];
      if (checkFn) {
        results.push(...checkFn(actual, expected));
      }
    }

    const passed = results.every((r) => r.passed);
    return { passed, checks: results };
  } catch (err) {
    return {
      passed: false,
      checks: [],
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
