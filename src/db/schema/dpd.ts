import {
  boolean,
  index,
  integer,
  json,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { ulid } from "ulidx";

export const pdpdTpsList = pgTable(
  "pdpd_tps_list",
  {
    id: integer("id").primaryKey(),
    kode: text("kode").notNull().unique(),
    nama: text("nama").notNull(),
    tingkat: integer("tingkat").notNull(),

    fetch_count: integer("fetch_count").default(0),

    updated_at: timestamp("updated_at").defaultNow(),
    created_at: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      tingkat_index: index("pdpd_tps_list_tingkat_index").on(table.tingkat),
      fetch_count_index: index("pdpd_tps_list_fetch_count_index").on(
        table.fetch_count,
      ),
      updated_at_index: index("pdpd_tps_list_updated_at_index").on(
        table.updated_at,
      ),
    };
  },
);

export const pdpdCalonList = pgTable("pdpd_calon_list", {
  nama: text("nama").notNull(),
  nomor_urut: integer("nomor_urut").notNull(),
  jenis_kelamin: text("jenis_kelamin").notNull(),
  tempat_tinggal: text("tempat_tinggal").notNull(),
  dapil_kode: text("dapil_kode").notNull(),
  calon_id: text("calon_id").primaryKey(),

  updated_at: timestamp("updated_at").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
});

export const pdpdTpsAdministrasi = pgTable("pdpd_tps_administrasi", {
  _id: text("_id").primaryKey().$defaultFn(ulid),

  tps: text("tps").unique().notNull(),

  images: text("images").array(),

  suara_sah: integer("suara_sah"),
  suara_total: integer("suara_total"),
  pemilih_dpt_j: integer("pemilih_dpt_j"),
  pemilih_dpt_l: integer("pemilih_dpt_l"),
  pemilih_dpt_p: integer("pemilih_dpt_p"),
  pengguna_dpt_j: integer("pengguna_dpt_j"),
  pengguna_dpt_l: integer("pengguna_dpt_l"),
  pengguna_dpt_p: integer("pengguna_dpt_p"),
  pengguna_dptb_j: integer("pengguna_dptb_j"),
  pengguna_dptb_l: integer("pengguna_dptb_l"),
  pengguna_dptb_p: integer("pengguna_dptb_p"),
  suara_tidak_sah: integer("suara_tidak_sah"),
  pengguna_total_j: integer("pengguna_total_j"),
  pengguna_total_l: integer("pengguna_total_l"),
  pengguna_total_p: integer("pengguna_total_p"),
  pengguna_non_dpt_j: integer("pengguna_non_dpt_j"),
  pengguna_non_dpt_l: integer("pengguna_non_dpt_l"),
  pengguna_non_dpt_p: integer("pengguna_non_dpt_p"),

  ts: text("ts").notNull(),
  psu: text("psu"),

  fetch_count: integer("fetch_count").default(0),
  updated_at: timestamp("updated_at").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
});

export const pdpdTpsChart = pgTable("pdpd_tps_chart", {
  calon_id: text("calon_id")
    .primaryKey()
    .references(() => pdpdCalonList.calon_id),
  tps: text("tps").references(() => pdpdTpsAdministrasi.tps),
  jumlah_suara: integer("jumlah_suara").notNull(),

  ts: text("ts").notNull(),

  fetch_count: integer("fetch_count").default(0),
  updated_at: timestamp("updated_at").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
});
