import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const repos = sqliteTable("repos", {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    language: text("language"),
    stars: integer("stars").notNull(),
    url: text("url").notNull(),
    fetched_at: text("fetched_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
});