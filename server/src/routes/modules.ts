import { Router } from "express";
import { listModules, getModule } from "../services/contentService.js";

export const modulesRouter = Router();

modulesRouter.get("/", (_req, res) => {
  const modules = listModules();
  res.json(modules);
});

modulesRouter.get("/:id", (req, res) => {
  const mod = getModule(req.params.id);
  if (!mod) {
    res.status(404).json({ error: "Module not found" });
    return;
  }
  res.json(mod);
});
