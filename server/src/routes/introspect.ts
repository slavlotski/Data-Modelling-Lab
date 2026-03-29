import { Router } from "express";
import { introspectSchema } from "../services/introspectionService.js";

export const introspectRouter = Router();

introspectRouter.get("/", async (_req, res) => {
  try {
    const schema = await introspectSchema();
    res.json(schema);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Introspection failed";
    res.status(500).json({ error: message });
  }
});
