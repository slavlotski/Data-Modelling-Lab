import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { config } from "../config.js";
import { challenges } from "./schema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function seed() {
  const pool = new pg.Pool(config.appDb);
  const db = drizzle(pool);

  const challengesDir = path.resolve(__dirname, "../..", config.contentDir, "challenges");

  if (!fs.existsSync(challengesDir)) {
    console.log("No challenges directory found, skipping seed.");
    await pool.end();
    return;
  }

  const moduleDirs = fs.readdirSync(challengesDir).filter((d) =>
    fs.statSync(path.join(challengesDir, d)).isDirectory()
  );

  let count = 0;
  for (const moduleDir of moduleDirs) {
    const modulePath = path.join(challengesDir, moduleDir);
    const files = fs.readdirSync(modulePath).filter((f) => f.endsWith(".json"));

    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(modulePath, file), "utf-8"));
      await db
        .insert(challenges)
        .values({
          moduleId: data.moduleId ?? moduleDir,
          slug: data.id ?? `${moduleDir}/${path.basename(file, ".json")}`,
          title: data.title,
          difficulty: data.difficulty ?? "medium",
          description: data.description,
          instructions: data.instructions,
          expected: data.expected,
          initialSql: data.initialSql ?? "",
          solutionSql: data.solutionSql,
          sortOrder: count,
        })
        .onConflictDoNothing();
      count++;
    }
  }

  console.log(`Seeded ${count} challenges.`);
  await pool.end();
}

seed().catch(console.error);
