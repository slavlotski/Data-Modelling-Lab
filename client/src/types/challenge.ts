export interface Challenge {
  id: number;
  moduleId: string;
  slug: string;
  title: string;
  difficulty: string;
  description: string;
  instructions: string;
  expected: unknown;
  initialSql: string;
  solutionSql: string;
  sortOrder: number;
}

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
