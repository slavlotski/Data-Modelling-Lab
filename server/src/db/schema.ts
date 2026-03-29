import { pgTable, serial, text, varchar, jsonb, integer } from "drizzle-orm/pg-core";

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  moduleId: varchar("module_id", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  title: varchar("title", { length: 300 }).notNull(),
  difficulty: varchar("difficulty", { length: 20 }).notNull(),
  description: text("description").notNull(),
  instructions: text("instructions").notNull(),
  expected: jsonb("expected").notNull(),
  initialSql: text("initial_sql").default(""),
  solutionSql: text("solution_sql").notNull(),
  sortOrder: integer("sort_order").default(0),
});
