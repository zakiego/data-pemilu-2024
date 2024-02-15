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

export const ppwpTps = pgTable("ppwp_tps", {
  kode: text("kode").primaryKey(),
  provinsi: text("provinsi").notNull(),
  kabupaten_kota: text("kabupaten_kota").notNull(),
  kecamatan: text("kecamatan").notNull(),
  kelurahan_desa: text("kelurahan_desa").notNull(),
  tps: text("tps").notNull(),
  suara_paslon_1: integer("suara_paslon_1"),
  suara_paslon_2: integer("suara_paslon_2"),
  suara_paslon_3: integer("suara_paslon_3"),
  chasil_1: text("chasil_hal_1"),
  chasil_2: text("chasil_hal_2"),
  chasil_3: text("chasil_hal_3"),
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
  psu: text("psu"),
  ts: text("ts"),
  status_suara: boolean("status_suara"),
  status_adm: boolean("status_adm"),
  updated_at: timestamp("updated_at").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
});
