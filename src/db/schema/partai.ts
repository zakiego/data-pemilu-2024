import {
  boolean,
  index,
  integer,
  json,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const partai = pgTable(
  "partai",
  {
    id_partai: integer("id_partai").primaryKey(),
    id_pilihan: integer("id_pilihan").notNull(),
    is_aceh: boolean("is_aceh").notNull(),
    nama: text("nama").notNull(),
    nama_lengkap: text("nama_lengkap").notNull(),
    nomor_urut: integer("nomor_urut").notNull(),
    warna: text("warna").notNull(),
    ts: text("ts").notNull(),

    updated_at: timestamp("updated_at").defaultNow(),
    created_at: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      id_pilihan_index: index("id_pilihan_index").on(table.id_pilihan),
      is_aceh_index: index("is_aceh_index").on(table.is_aceh),
      nomor_urut_index: index("nomor_urut_index").on(table.nomor_urut),
      nama_index: index("nama_index").on(table.nama),
    };
  },
);
