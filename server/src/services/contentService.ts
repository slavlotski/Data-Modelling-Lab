import fs from "fs";
import path from "path";
import { config } from "../config.js";

export interface ModuleMeta {
  id: string;
  title: string;
  order: number;
  description: string;
  part: string;
  prerequisites: string[];
}

export interface ModuleSection {
  slug: string;
  title: string;
  content: string;
  order: number;
}

export interface ModuleWithSections extends ModuleMeta {
  sections: ModuleSection[];
}

function getContentDir(): string {
  return path.resolve(process.cwd(), config.contentDir);
}

export function listModules(): ModuleMeta[] {
  const modulesDir = path.join(getContentDir(), "modules");
  if (!fs.existsSync(modulesDir)) return [];

  const dirs = fs.readdirSync(modulesDir).filter((d) =>
    fs.statSync(path.join(modulesDir, d)).isDirectory()
  );

  return dirs
    .map((dir) => {
      const metaPath = path.join(modulesDir, dir, "meta.json");
      if (!fs.existsSync(metaPath)) return null;
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
      return { ...meta, id: dir } as ModuleMeta;
    })
    .filter((m): m is ModuleMeta => m !== null)
    .sort((a, b) => a.order - b.order);
}

export function getModule(moduleId: string): ModuleWithSections | null {
  const moduleDir = path.join(getContentDir(), "modules", moduleId);
  if (!fs.existsSync(moduleDir)) return null;

  const metaPath = path.join(moduleDir, "meta.json");
  if (!fs.existsSync(metaPath)) return null;

  const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));

  const mdFiles = fs
    .readdirSync(moduleDir)
    .filter((f) => f.endsWith(".md"))
    .sort();

  const sections: ModuleSection[] = mdFiles.map((file, idx) => {
    const content = fs.readFileSync(path.join(moduleDir, file), "utf-8");
    const slug = path.basename(file, ".md");
    const title = content.split("\n").find((l) => l.startsWith("# "))?.replace(/^#\s+/, "") ?? slug;
    return { slug, title, content, order: idx };
  });

  return { ...meta, id: moduleId, sections };
}
