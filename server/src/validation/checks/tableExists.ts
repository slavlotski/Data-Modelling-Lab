import type { SchemaSnapshot } from "../../services/introspectionService.js";
import type { ExpectedSchema, CheckResult } from "../../services/validationService.js";

export function tableExists(actual: SchemaSnapshot, expected: ExpectedSchema): CheckResult[] {
  return expected.tables.map((t) => {
    const found = actual.tables.some((at) => at.name === t.name);
    return {
      name: `Table "${t.name}" exists`,
      passed: found,
      message: found ? `Table "${t.name}" found.` : `Table "${t.name}" is missing.`,
    };
  });
}
