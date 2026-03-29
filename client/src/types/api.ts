export interface SqlExecutionResult {
  rows: Record<string, unknown>[];
  fields: string[];
  rowCount: number | null;
  command: string;
}

export interface ApiError {
  error: string;
}
