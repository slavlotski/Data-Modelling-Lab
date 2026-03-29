import { apiFetch } from "./client";
import type { SqlExecutionResult } from "../types/api";
import type { SchemaSnapshot } from "../types/diagram";

export function executeSql(sql: string) {
  return apiFetch<SqlExecutionResult>("/sandbox/execute", {
    method: "POST",
    body: JSON.stringify({ sql }),
  });
}

export function resetSandbox() {
  return apiFetch<{ message: string }>("/sandbox/reset", { method: "POST" });
}

export function introspectSchema() {
  return apiFetch<SchemaSnapshot>("/introspect");
}
