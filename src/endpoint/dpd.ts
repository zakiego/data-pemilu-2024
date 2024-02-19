import { strictFetch } from "@/utils/fetch";
import { filter } from "lodash";
import { z } from "zod";

export const dpd = {
  getDapilCalonList: async (dapilId: string) => {
    const url = `https://sirekap-obj-data.kpu.go.id/pemilu/caleg/dpd/${dapilId}.json`;

    const schema = z.record(
      z.coerce.number(),
      z
        .object({
          nama: z.string(),
          nomor_urut: z.number(),
          jenis_kelamin: z.enum(["L", "P"]),
          tempat_tinggal: z.string(),
        })
        .strict(),
    );

    const response = await strictFetch(url, schema);

    const flat = Object.entries(response).map(([calonId, calon]) => {
      return {
        ...calon,
        dapil_kode: dapilId,
        calon_id: calonId,
      };
    });

    return flat;
  },
  getTpsDetail: async (id: string) => {
    if (id.length !== 13) {
      throw new Error("Invalid TPS ID");
    }

    const url = `https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/pdpd/${id.substring(
      0,
      2,
    )}/${id.substring(0, 4)}/${id.substring(0, 6)}/${id.substring(
      0,
      10,
    )}/${id}.json`;

    const schema = z
      .object({
        mode: z.enum(["hhcw"]).optional(),
        chart: z
          .record(z.string().nullable(), z.number().nullable())
          .nullable(),
        images: z.array(z.string().nullable()).min(1),
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
        psu: z.enum(["Pemungutan Suara Ulang"]),
        ts: z.string(),
        status_suara: z.boolean(),
        status_adm: z.boolean(),
      })
      .strict();

    const response = await strictFetch(url, schema);

    const flatSuara =
      response.chart &&
      Object.entries(response.chart).map(([calonId, jumlahSuara]) => {
        if (calonId === "null") return;

        return {
          calon_id: calonId,
          tps: id,
          jumlah_suara: jumlahSuara,
        };
      });

    const filteredFlatSuara = filter(
      flatSuara,
      (suara) => suara !== undefined,
    ) as unknown as {
      calon_id: string;
      tps: string;
      jumlah_suara: number;
    }[];

    return {
      ...response,
      suara: filteredFlatSuara,
    };
  },
};
