import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const data = sqliteTable("data", {
  id: text("id").primaryKey(),
  data: text("data", {
    mode: "json",
  }).$type<any>(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});
