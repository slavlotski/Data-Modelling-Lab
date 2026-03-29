import { useState } from "react";
import { executeSql } from "../api/sandbox";
import type { SqlExecutionResult } from "../types/api";

export function useSqlExecution() {
  const [result, setResult] = useState<SqlExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function execute(sql: string) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await executeSql(sql);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Execution failed");
    } finally {
      setLoading(false);
    }
  }

  return { result, error, loading, execute };
}
