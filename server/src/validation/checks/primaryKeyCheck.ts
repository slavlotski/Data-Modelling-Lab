import type { SchemaSnapshot } from "../../services/introspectionService.js";
import type { ExpectedSchema, CheckResult } from "../../services/validationService.js";

export function primaryKeyCheck(actual: SchemaSnapshot, expected: ExpectedSchema): CheckResult[] {
  const results: CheckResult[] = [];

  for (const expectedTable of expected.tables) {
    if (!expectedTable.primaryKey) continue;

    const actualTable = actual.tables.find((t) => t.name === expectedTable.name);
    if (!actualTable) continue;

    const pk = actualTable.constraints.find((c) => c.type === "PRIMARY KEY");
    if (!pk) {
      results.push({
        name: `Table "${expectedTable.name}" has a primary key`,
        passed: false,
        message: `No primary key found on table "${expectedTable.name}".`,
      });
      continue;
    }

    const expectedCols = [...expectedTable.primaryKey].sort();
    const actualCols = [...pk.columns].sort();
    const match = JSON.stringify(expectedCols) === JSON.stringify(actualCols);

    results.push({
      name: `Table "${expectedTable.name}" primary key columns`,
      passed: match,
      message: match
        ? `Primary key is correct (${actualCols.join(", ")}).`
        : `Expected PK (${expectedCols.join(", ")}) but got (${actualCols.join(", ")}).`,
    });
  }

  return results;
}
