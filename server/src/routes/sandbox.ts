import { Router } from "express";
import { executeSandboxSql, resetSandbox } from "../db/sandboxDb.js";

export const sandboxRouter = Router();

sandboxRouter.post("/execute", async (req, res) => {
  const { sql } = req.body;
  if (!sql || typeof sql !== "string") {
    res.status(400).json({ error: "SQL string is required" });
    return;
  }

  try {
    const result = await executeSandboxSql(sql);
    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "SQL execution failed";
    res.status(400).json({ error: message });
  }
});

sandboxRouter.post("/reset", async (_req, res) => {
  try {
    await resetSandbox();
    res.json({ message: "Sandbox reset." });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Reset failed";
    res.status(500).json({ error: message });
  }
});
