import { strictFetch } from "@/utils/fetch";
import { z } from "zod";

export const presiden = {
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
