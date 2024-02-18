import {
  boolean,
  index,
  integer,
  json,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const wilayah = pgTable(
  "wilayah",
  {
    id: integer("id").primaryKey(),
    kode: text("kode").notNull().unique(),
    nama: text("nama").notNull(),
    tingkat: integer("tingkat").notNull(),

    is_fetched_presiden: boolean("is_fetched_presiden").default(false),
    is_fetched_dpr: boolean("is_fetched_dpr").default(false),
    is_fetched_dpd: boolean("is_fetched_dpd").default(false),
    is_fetched_dprd_provinsi: boolean("is_fetched_dprd_provinsi").default(
      false,
    ),
    is_fetched_dprd_kabupaten_kota: boolean(
      "is_fetched_dprd_kabupaten_kota",
    ).default(false),

    updated_at: timestamp("updated_at").defaultNow(),
    created_at: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      tingkat_index: index("tingkat_index").on(table.tingkat),
      is_fetched_presiden_index: index("is_fetched_presiden_index").on(
        table.is_fetched_presiden,
      ),
      is_fetched_dpr_index: index("is_fetched_dpr_index").on(
        table.is_fetched_dpr,
      ),
      is_fetched_dpd_index: index("is_fetched_dpd_index").on(
        table.is_fetched_dpd,
      ),
      is_fetched_dprd_provinsi_index: index(
        "is_fetched_dprd_provinsi_index",
      ).on(table.is_fetched_dprd_provinsi),
      is_fetched_dprd_kabupaten_kota_index: index(
        "is_fetched_dprd_kabupaten_kota_index",
      ).on(table.is_fetched_dprd_kabupaten_kota),
    };
  },
);
