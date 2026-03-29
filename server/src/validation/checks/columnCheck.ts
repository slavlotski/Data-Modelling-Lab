import type { SchemaSnapshot } from "../../services/introspectionService.js";
import type { ExpectedSchema, CheckResult } from "../../services/validationService.js";

export function columnCheck(actual: SchemaSnapshot, expected: ExpectedSchema): CheckResult[] {
  const results: CheckResult[] = [];

  for (const expectedTable of expected.tables) {
    if (!expectedTable.columns) continue;

    const actualTable = actual.tables.find((t) => t.name === expectedTable.name);
    if (!actualTable) continue;

    for (const expectedCol of expectedTable.columns) {
      const actualCol = actualTable.columns.find((c) => c.name === expectedCol.name);

      if (!actualCol) {
        results.push({
          name: `Column "${expectedTable.name}.${expectedCol.name}" exists`,
          passed: false,
          message: `Column "${expectedCol.name}" is missing from table "${expectedTable.name}".`,
        });
        continue;
      }

      if (expectedCol.type) {
        const typeMatch = actualCol.type.toLowerCase().includes(expectedCol.type.toLowerCase());
        results.push({
          name: `Column "${expectedTable.name}.${expectedCol.name}" has correct type`,
          passed: typeMatch,
          message: typeMatch
            ? `Column type is correct (${actualCol.type}).`
            : `Expected type "${expectedCol.type}" but got "${actualCol.type}".`,
        });
      }

      if (expectedCol.nullable !== undefined) {
        const nullMatch = actualCol.nullable === expectedCol.nullable;
        results.push({
          name: `Column "${expectedTable.name}.${expectedCol.name}" nullability`,
          passed: nullMatch,
          message: nullMatch
            ? `Nullability is correct.`
            : `Expected nullable=${expectedCol.nullable} but got nullable=${actualCol.nullable}.`,
        });
      }
    }
  }

  return results;
}
