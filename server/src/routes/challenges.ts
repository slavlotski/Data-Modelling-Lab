import { Router } from "express";
import { eq } from "drizzle-orm";
import { appDb } from "../db/appDb.js";
import { challenges } from "../db/schema.js";
import { validateChallenge } from "../services/validationService.js";

export const challengesRouter = Router();

challengesRouter.get("/", async (_req, res) => {
  const all = await appDb.select().from(challenges).orderBy(challenges.sortOrder);
  res.json(all);
});

challengesRouter.get("/:slug", async (req, res) => {
  const [challenge] = await appDb
    .select()
    .from(challenges)
    .where(eq(challenges.slug, req.params.slug));

  if (!challenge) {
    res.status(404).json({ error: "Challenge not found" });
    return;
  }
  res.json(challenge);
});

challengesRouter.post("/:slug/submit", async (req, res) => {
  const { sql } = req.body;
  if (!sql || typeof sql !== "string") {
    res.status(400).json({ error: "SQL string is required" });
    return;
  }

  const [challenge] = await appDb
    .select()
    .from(challenges)
    .where(eq(challenges.slug, req.params.slug));

  if (!challenge) {
    res.status(404).json({ error: "Challenge not found" });
    return;
  }

  const result = await validateChallenge(sql, challenge.expected as any);
  res.json(result);
});
