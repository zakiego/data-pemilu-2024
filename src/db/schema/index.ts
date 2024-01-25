import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { ulid } from "ulidx";

export const data = sqliteTable("data", {
  id: text("id").primaryKey().$defaultFn(ulid),
  data: text("data", {
    mode: "json",
  }).$type<any>(),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});
