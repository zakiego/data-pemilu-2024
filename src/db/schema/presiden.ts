import {
  boolean,
  index,
  integer,
  json,
  numeric,
  pgTable,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const ppwpNasional = pgTable("ppwp_nasional", {
  kode: text("kode").primaryKey(),

  suara_paslon_1: integer("suara_paslon_1"),
  suara_paslon_2: integer("suara_paslon_2"),
  suara_paslon_3: integer("suara_paslon_3"),

  persen_suara_masuk: real("persen_suara_masuk"),
  psu: text("psu"),
  ts: text("ts"),

  url_page: text("_url_page"),
  url_api: text("_url_api"),
  updated_at: timestamp("_updated_at").defaultNow(),
  created_at: timestamp("_created_at").defaultNow(),
  fetch_count: integer("_fetch_count").default(0),
});

export const ppwpProvinsi = pgTable("ppwp_provinsi", {
  kode: text("kode").primaryKey(),
  provinsi_kode: text("provinsi_kode"),
  provinsi_nama: text("provinsi_nama"),

  suara_paslon_1: integer("suara_paslon_1"),
  suara_paslon_2: integer("suara_paslon_2"),
  suara_paslon_3: integer("suara_paslon_3"),

  persen: real("persen"),
  status_progress: boolean("status_progress"),
  psu: text("psu"),
  ts: text("ts"),

  url_page: text("_url_page"),
  url_api: text("_url_api"),
  updated_at: timestamp("_updated_at").defaultNow(),
  created_at: timestamp("_created_at").defaultNow(),
  fetch_count: integer("_fetch_count").default(0),
});

export const ppwpKabupatenKota = pgTable("ppwp_kabupaten_kota", {
  kode: text("kode").primaryKey(),
  provinsi_kode: text("provinsi_kode"),
  provinsi_nama: text("provinsi_nama"),

  kabupaten_kota_kode: text("kabupaten_kota_kode"),
  kabupaten_kota_nama: text("kabupaten_kota_nama"),

  suara_paslon_1: integer("suara_paslon_1"),
  suara_paslon_2: integer("suara_paslon_2"),
  suara_paslon_3: integer("suara_paslon_3"),

  persen: real("persen"),
  status_progress: boolean("status_progress"),
  psu: text("psu"),
  ts: text("ts"),

  url_page: text("_url_page"),
  url_api: text("_url_api"),
  updated_at: timestamp("_updated_at").defaultNow(),
  created_at: timestamp("_created_at").defaultNow(),
  fetch_count: integer("_fetch_count").default(0),
});

export const ppwpKecamatan = pgTable("ppwp_kecamatan", {
  kode: text("kode").primaryKey(),
  provinsi_kode: text("provinsi_kode"),
  provinsi_nama: text("provinsi_nama"),

  kabupaten_kota_kode: text("kabupaten_kota_kode"),
  kabupaten_kota_nama: text("kabupaten_kota_nama"),

  kecamatan_kode: text("kecamatan_kode"),
  kecamatan_nama: text("kecamatan_nama"),

  suara_paslon_1: integer("suara_paslon_1"),
  suara_paslon_2: integer("suara_paslon_2"),
  suara_paslon_3: integer("suara_paslon_3"),

  persen: real("persen"),
  status_progress: boolean("status_progress"),
  psu: text("psu"),
  ts: text("ts"),

  url_page: text("_url_page"),
  url_api: text("_url_api"),
  updated_at: timestamp("_updated_at").defaultNow(),
  created_at: timestamp("_created_at").defaultNow(),
  fetch_count: integer("_fetch_count").default(0),
});

export const ppwpKelurahanDesa = pgTable("ppwp_kelurahan_desa", {
  kode: text("kode").primaryKey(),
  provinsi_kode: text("provinsi_kode"),
  provinsi_nama: text("provinsi_nama"),

  kabupaten_kota_kode: text("kabupaten_kota_kode"),
  kabupaten_kota_nama: text("kabupaten_kota_nama"),

  kecamatan_kode: text("kecamatan_kode"),
  kecamatan_nama: text("kecamatan_nama"),

  kelurahan_desa_kode: text("kelurahan_desa_kode"),
  kelurahan_desa_nama: text("kelurahan_desa_nama"),

  suara_paslon_1: integer("suara_paslon_1"),
  suara_paslon_2: integer("suara_paslon_2"),
  suara_paslon_3: integer("suara_paslon_3"),

  persen: real("persen"),
  status_progress: boolean("status_progress"),
  psu: text("psu"),
  ts: text("ts"),

  url_page: text("_url_page"),
  url_api: text("_url_api"),

  updated_at: timestamp("_updated_at").defaultNow(),
  created_at: timestamp("_created_at").defaultNow(),
  fetch_count: integer("_fetch_count").default(0),
});

export const ppwpTps = pgTable("ppwp_tps", {
  kode: text("kode").primaryKey(),
  provinsi_kode: text("provinsi_kode").notNull(),
  provinsi_nama: text("provinsi_nama"),
  kabupaten_kota_kode: text("kabupaten_kota_kode").notNull(),
  kabupaten_kota_nama: text("kabupaten_kota_nama"),
  kecamatan_kode: text("kecamatan_kode").notNull(),
  kecamatan_nama: text("kecamatan_nama"),
  kelurahan_desa_kode: text("kelurahan_desa_kode").notNull(),
  kelurahan_desa_nama: text("kelurahan_desa_nama"),
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
  url_page: text("url_page"),
  url_api: text("url_api"),
  updated_at: timestamp("updated_at").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
  fetch_count: integer("fetch_count").default(0),
});
