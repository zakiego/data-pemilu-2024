import { partai } from "@/db/schema/partai";
import { wilayah } from "@/db/schema/wilayah";
import {
  boolean,
  index,
  integer,
  json,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { ulid } from "ulidx";

// -- Legacy Schema

export const pdprTps = pgTable("_pdpr_tps_legacy", {
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

  suara_partai_1: integer("suara_partai_1"),
  suara_partai_2: integer("suara_partai_2"),
  suara_partai_3: integer("suara_partai_3"),
  suara_partai_4: integer("suara_partai_4"),
  suara_partai_5: integer("suara_partai_5"),
  suara_partai_6: integer("suara_partai_6"),
  suara_partai_7: integer("suara_partai_7"),
  suara_partai_8: integer("suara_partai_8"),
  suara_partai_9: integer("suara_partai_9"),
  suara_partai_10: integer("suara_partai_10"),
  suara_partai_11: integer("suara_partai_11"),
  suara_partai_12: integer("suara_partai_12"),
  suara_partai_13: integer("suara_partai_13"),
  suara_partai_14: integer("suara_partai_14"),
  suara_partai_15: integer("suara_partai_15"),
  suara_partai_16: integer("suara_partai_16"),
  suara_partai_17: integer("suara_partai_17"),
  suara_partai_18: integer("suara_partai_18"),
  suara_partai_19: integer("suara_partai_19"),
  suara_partai_20: integer("suara_partai_20"),
  suara_partai_21: integer("suara_partai_21"),
  suara_partai_22: integer("suara_partai_22"),
  suara_partai_23: integer("suara_partai_23"),
  suara_partai_24: integer("suara_partai_24"),

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

export const pdprDapilList = pgTable("_pdpr_dapil_list_legacy", {
  id: integer("id").primaryKey(),
  nama: text("nama").notNull(),
  kode: text("kode").notNull(),
  updated_at: timestamp("updated_at").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),

  fetch_count: integer("fetch_count").default(0),
  is_calon_fetched: boolean("is_calon_fetched").default(false),
});

export const pdprDapilCalonList = pgTable("_pdpr_dapil_calon_list_legacy", {
  nama: text("nama").notNull(),
  jenis_kelamin: text("jenis_kelamin").notNull(),
  tempat_tinggal: text("tempat_tinggal").notNull(),
  calon_id: text("calon_id").primaryKey(),
  partai_id: text("partai_id").notNull(),
  nomor_urut_calon_di_partai: integer("nomor_urut_calon_di_partai").notNull(),

  jumlah_suara: integer("jumlah_suara"),

  dapil_kode: text("dapil_kode").notNull(),
  ts: text("ts"),

  updated_at: timestamp("updated_at").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
});

// -- New Schema

export const pdprTpsList = pgTable(
  "pdpr_tps_list",
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
      tingkat_index: index("pdpr_tps_list_tingkat_index").on(table.tingkat),
      fetch_count_index: index("pdpr_tps_list_fetch_count_index").on(
        table.fetch_count,
      ),
      updated_at_index: index("pdpr_tps_list_updated_at_index").on(
        table.updated_at,
      ),
    };
  },
);

export const pdprCalonList = pgTable("pdpr_calon_list", {
  nama: text("nama").notNull(),
  nomor_urut: integer("nomor_urut").notNull(),
  jenis_kelamin: text("jenis_kelamin").notNull(),
  tempat_tinggal: text("tempat_tinggal").notNull(),
  dapil_kode: text("dapil_kode").notNull(),
  calon_id: text("calon_id").primaryKey(),

  updated_at: timestamp("updated_at").defaultNow(),
  created_at: timestamp("created_at").defaultNow(),
});

export const pdprTpsAdministrasi = pgTable("pdpr_tps_administrasi", {
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

export const pdprTpsPartai = pgTable(
  "pdpr_tps_partai",
  {
    _id: text("_id").primaryKey().$defaultFn(ulid),
    tps: text("tps").references(() => pdprTpsList.kode),

    partai_id: text("partai_id"),

    jumlah_suara_total: integer("jumlah_suara_total").notNull(),
    jumlah_suara_partai: integer("jumlah_suara_partai").notNull(),

    ts: text("ts").notNull(),

    fetch_count: integer("fetch_count").default(0),
    updated_at: timestamp("updated_at").defaultNow(),
    created_at: timestamp("created_at").defaultNow(),
  },
  (t) => ({
    tps_partai_id_unique: unique("pdpr_tps_partai_tps_partai_id_unique").on(
      t.tps,
      t.partai_id,
    ),
  }),
);

export const pdprTpsCaleg = pgTable(
  "pdpr_tps_caleg",
  {
    _id: text("_id").primaryKey().$defaultFn(ulid),
    calon_id: text("calon_id").references(() => pdprCalonList.calon_id),
    tps: text("tps").references(() => pdprTpsList.kode),
    jumlah_suara: integer("jumlah_suara").notNull(),

    ts: text("ts").notNull(),

    fetch_count: integer("fetch_count").default(0),
    updated_at: timestamp("updated_at").defaultNow(),
    created_at: timestamp("created_at").defaultNow(),
  },
  (t) => ({
    tps_calon_id_unique: unique("pdpr_tps_chart_tps_calon_id_unique").on(
      t.tps,
      t.calon_id,
    ),
  }),
);
