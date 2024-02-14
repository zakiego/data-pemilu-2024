import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const wilayah = pgTable("wilayah", {
  id: integer("id").primaryKey(),
  kode: text("kode").notNull(),
  nama: text("nama").notNull(),
  tingkat: integer("tingkat").notNull(),
  is_fetched: boolean("is_fetched").default(false),
  updated_at: timestamp("updated_at").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
});
