import { apiFetch } from "./client";
import type { Challenge, ValidationResult } from "../types/challenge";

export function fetchChallenges() {
  return apiFetch<Challenge[]>("/challenges");
}

export function fetchChallenge(slug: string) {
  return apiFetch<Challenge>(`/challenges/${slug}`);
}

export function submitChallenge(slug: string, sql: string) {
  return apiFetch<ValidationResult>(`/challenges/${slug}/submit`, {
    method: "POST",
    body: JSON.stringify({ sql }),
  });
}
