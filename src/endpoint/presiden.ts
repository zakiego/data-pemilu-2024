import { psuEnum } from "@/endpoint/schema";
import { strictFetch } from "@/utils/fetch";
import { string, z } from "zod";

export const presiden = {
  get_suara_by_provinsi: async () => {
    const apiUrl = "https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp.json";
    const pageUrl = "https://pemilu2024.kpu.go.id/pilpres/hitung-suara";

    const schema = z
      .object({
        ts: z.string(),
        psu: psuEnum,
        mode: z.enum(["hhcw"]),
        chart: z.record(
          z.enum(["100025", "100026", "100027", "persen"]),
          z.number(),
        ),
        table: z.record(
          z.string(),
          z.object({
            "100025": z.number(),
            "100026": z.number(),
            "100027": z.number(),
            psu: psuEnum,
            persen: z.number(),
            status_progress: z.boolean(),
          }),
        ),
        progres: z.object({
          total: z.number().nullable(),
          progres: z.number().nullable(),
        }),
      })
      .strict();

    const data = await strictFetch(apiUrl, schema);

    const flatTable = Object.entries(data.table).map(([key, value]) => ({
      ...value,
      provinsi: key,
    }));

    return { data: { ...data, _flat_table: flatTable }, apiUrl, pageUrl };
  },
  get_suara_by_kabupaten_kota: async ({
    provinsi_kode,
  }: {
    provinsi_kode: string;
  }) => {
    if (provinsi_kode.length !== 2) {
      throw new Error("Invalid provinsi code");
    }
    const apiUrl = `https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp/${provinsi_kode}.json`;
    const pageUrl = `https://pemilu2024.kpu.go.id/pilpres/hitung-suara/${provinsi_kode}`;

    const schema = z
      .object({
        ts: z.string(),
        psu: psuEnum,
        mode: z.enum(["hhcw"]),
        chart: z.record(
          z.enum(["100025", "100026", "100027", "persen"]),
          z.number(),
        ),
        table: z.record(
          z.string(),
          z.object({
            "100025": z.number().optional(),
            "100026": z.number().optional(),
            "100027": z.number().optional(),
            psu: psuEnum,
            persen: z.number(),
            status_progress: z.boolean(),
          }),
        ),
        progres: z.object({
          total: z.number(),
          progres: z.number(),
        }),
      })
      .strict();

    const data = await strictFetch(apiUrl, schema);

    const flatTable = Object.entries(data.table).map(([key, value]) => ({
      ...value,
      kabupaten_kota: key,
    }));

    return { data: { ...data, _flat_table: flatTable }, apiUrl, pageUrl };
  },
  get_suara_by_kecamatan: async ({
    kabupaten_kode,
  }: { kabupaten_kode: string }) => {
    if (kabupaten_kode.length !== 4) {
      throw new Error("Invalid kabupaten code");
    }

    const provinsi_kode = kabupaten_kode.substring(0, 2);

    const apiUrl = `https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp/${provinsi_kode}/${kabupaten_kode}.json`;
    const pageUrl = `https://pemilu2024.kpu.go.id/pilpres/hitung-suara/${provinsi_kode}/${kabupaten_kode}`;

    const schema = z
      .object({
        ts: z.string(),
        psu: psuEnum,
        mode: z.enum(["hhcw"]).nullish(),
        chart: z
          .record(z.enum(["100025", "100026", "100027", "persen"]), z.number())
          .nullable(),
        table: z.record(
          z.string(),
          z.object({
            "100025": z.number().optional(),
            "100026": z.number().optional(),
            "100027": z.number().optional(),
            psu: psuEnum,
            persen: z.number().nullish(),
            status_progress: z.boolean().nullish(),
          }),
        ),
        progres: z.object({
          total: z.number().nullable(),
          progres: z.number().nullable(),
        }),
      })
      .strict();

    const data = await strictFetch(apiUrl, schema);

    const flatTable = Object.entries(data.table).map(([key, value]) => ({
      ...value,
      kecamatan: key,
    }));

    return { data: { ...data, _flat_table: flatTable }, apiUrl, pageUrl };
  },
  get_suara_by_kelurahan_desa: async ({
    kecamatan_kode,
  }: {
    kecamatan_kode: string;
  }) => {
    if (kecamatan_kode.length !== 6) {
      throw new Error("Invalid kecamatan code");
    }

    const provinsi_kode = kecamatan_kode.substring(0, 2);
    const kabupaten_kode = kecamatan_kode.substring(0, 4);

    const apiUrl = `https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp/${provinsi_kode}/${kabupaten_kode}/${kecamatan_kode}.json`;
    const pageUrl = `https://pemilu2024.kpu.go.id/pilpres/hitung-suara/${provinsi_kode}/${kabupaten_kode}/${kecamatan_kode}`;

    const schema = z
      .object({
        ts: z.string(),
        psu: psuEnum,
        mode: z.enum(["hhcw"]).nullish(),
        chart: z
          .record(z.enum(["100025", "100026", "100027", "persen"]), z.number())
          .nullable(),
        table: z.record(
          z.string(),
          z.object({
            "100025": z.number().optional(),
            "100026": z.number().optional(),
            "100027": z.number().optional(),
            psu: psuEnum,
            persen: z.number().nullish(),
            status_progress: z.boolean().nullish(),
          }),
        ),
        progres: z.object({
          total: z.number().nullable(),
          progres: z.number().nullable(),
        }),
      })
      .strict();

    const data = await strictFetch(apiUrl, schema);

    const flatTable = Object.entries(data.table).map(([key, value]) => ({
      ...value,
      kelurahan_desa: key,
    }));

    return { data: { ...data, _flat_table: flatTable }, apiUrl, pageUrl };
  },
  get_detail_tps: async (id: string) => {
    if (id.length !== 13) {
      throw new Error("Invalid TPS ID");
    }

    const url = `https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp/${id.substring(
      0,
      2,
    )}/${id.substring(0, 4)}/${id.substring(0, 6)}/${id.substring(
      0,
      10,
    )}/${id}.json`;

    const schema = z.object({
      chart: z.record(z.string().nullable(), z.number().nullable()).nullable(),
      images: z.array(z.string().nullable()).length(3),
      administrasi: z
        .object({
          suara_sah: z.number().nullable(),
          suara_total: z.number().nullable(),
          pemilih_dpt_j: z.number().nullable(),
          pemilih_dpt_l: z.number().nullable(),
          pemilih_dpt_p: z.number().nullable(),
          pengguna_dpt_j: z.number().nullable(),
          pengguna_dpt_l: z.number().nullable(),
          pengguna_dpt_p: z.number().nullable(),
          pengguna_dptb_j: z.number().nullable(),
          pengguna_dptb_l: z.number().nullable(),
          pengguna_dptb_p: z.number().nullable(),
          suara_tidak_sah: z.number().nullable(),
          pengguna_total_j: z.number().nullable(),
          pengguna_total_l: z.number().nullable(),
          pengguna_total_p: z.number().nullable(),
          pengguna_non_dpt_j: z.number().nullable(),
          pengguna_non_dpt_l: z.number().nullable(),
          pengguna_non_dpt_p: z.number().nullable(),
        })
        .nullable(),
      psu: z
        .enum(["Pemungutan Suara Ulang", "Penghitungan Suara Ulang"])
        .nullable(),
      ts: z.string(),
      status_suara: z.boolean(),
      status_adm: z.boolean(),
    });

    const data = await strictFetch(url, schema);

    return data;
  },
};
