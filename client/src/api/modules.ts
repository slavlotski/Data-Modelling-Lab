import { apiFetch } from "./client";
import type { ModuleMeta, ModuleWithSections } from "../types/module";

export function fetchModules() {
  return apiFetch<ModuleMeta[]>("/modules");
}

export function fetchModule(id: string) {
  return apiFetch<ModuleWithSections>(`/modules/${id}`);
}
