import type { SchemaSnapshot } from "../../services/introspectionService.js";
import type { ExpectedSchema, CheckResult } from "../../services/validationService.js";

export function foreignKeyCheck(actual: SchemaSnapshot, expected: ExpectedSchema): CheckResult[] {
  const results: CheckResult[] = [];

  for (const expectedTable of expected.tables) {
    if (!expectedTable.foreignKeys) continue;

    const actualTable = actual.tables.find((t) => t.name === expectedTable.name);
    if (!actualTable) continue;

    for (const expectedFk of expectedTable.foreignKeys) {
      const found = actualTable.constraints.some(
        (c) =>
          c.type === "FOREIGN KEY" &&
          c.referencedTable === expectedFk.referencedTable &&
          JSON.stringify([...c.columns].sort()) ===
            JSON.stringify([...expectedFk.columns].sort())
      );

      results.push({
        name: `FK "${expectedTable.name}(${expectedFk.columns.join(", ")}) → ${expectedFk.referencedTable}"`,
        passed: found,
        message: found
          ? `Foreign key relationship found.`
          : `Missing FK from "${expectedTable.name}(${expectedFk.columns.join(", ")})" to "${expectedFk.referencedTable}(${expectedFk.referencedColumns.join(", ")})".`,
      });
    }
  }

  return results;
}
