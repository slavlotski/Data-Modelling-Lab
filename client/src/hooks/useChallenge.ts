import { useState } from "react";
import { submitChallenge } from "../api/challenges";
import type { ValidationResult } from "../types/challenge";

export function useChallenge(slug: string) {
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(sql: string) {
    setLoading(true);
    setResult(null);
    try {
      const res = await submitChallenge(slug, sql);
      setResult(res);
    } catch (err) {
      setResult({
        passed: false,
        checks: [],
        error: err instanceof Error ? err.message : "Submission failed",
      });
    } finally {
      setLoading(false);
    }
  }

  return { result, loading, submit };
}
