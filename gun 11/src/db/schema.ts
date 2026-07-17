import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const developers = sqliteTable("developers", {
    id: integer("id").primaryKey({ autoIncrement: true}),
    name: text("name").notNull(),
    email: text("email").unique().notNull(),
    team: text("team").notNull(),
});

export const commits = sqliteTable("commits", {
    id: integer("id").primaryKey({ autoIncrement: true}),
    message: text("message").notNull(),
    developer_id: integer("developer_id").notNull()
        .references(() => developers.id),
    merge_request_id: integer("merge_request_id").notNull()
        .references(() => merge_requests.id),
    created_at: text("created_at").notNull(),
});

export const merge_requests = sqliteTable("merge_requests", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("text").notNull(),
    developer_id: integer("developer.id").notNull()
        .references(() => developers.id),
    created_at: text("created_at").notNull(),
    merged_at: text("merged_at"),
    status: text("status").notNull(),
});