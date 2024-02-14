import { strictFetch } from "@/utils/fetch";
import { z } from "zod";

const wilayahSchema = z.array(
  z.object({
    id: z.number(),
    kode: z.string(),
    nama: z.string(),
    tingkat: z.number(),
  }),
);

export const pilpres = {
  wilayah: {
    list_provinsi: async () => {
      const url =
        "https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/0.json";
      return await strictFetch(url, wilayahSchema);
    },
    list_kabupaten_kota: async (id: string) => {
      const url = `https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${id}.json`;
      return await strictFetch(url, wilayahSchema);
    },
    list_kecamatan: async (id: string) => {
      const url = `https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${id.substring(
        0,
        2,
      )}/${id.substring(0, 4)}/${id}.json`;
      return await strictFetch(url, wilayahSchema);
    },
    list_kelurahan_desa: async (id: string) => {
      const url = `https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${id.substring(
        0,
        2,
      )}/${id.substring(0, 4)}/${id}.json`;
      return await strictFetch(url, wilayahSchema);
    },
    get_list_tps: async (id: string) => {
      const url = `https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${id.substring(
        0,
        2,
      )}/${id.substring(0, 4)}/${id.substring(0, 6)}/${id}.json`;

      const data = await strictFetch(url, wilayahSchema);

      return data;
    },
    get_detail_tps: async (id: string) => {
      if (id.length !== 13) {
        throw new Error("Invalid TPS ID");
      }

      // https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp/11/1171/117102/1171022005/1171022005001.json
      const url = `https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/ppwp/${id.substring(
        0,
        2,
      )}/${id.substring(0, 4)}/${id.substring(0, 6)}/${id.substring(
        0,
        10,
      )}/${id}.json`;

      const schema = z.object({
        chart: z
          .record(z.string().nullable(), z.number().nullable())
          .nullable(),
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
        psu: z.null(),
        ts: z.string(),
        status_suara: z.boolean(),
        status_adm: z.boolean(),
      });

      const data = await strictFetch(url, schema);

      return data;
    },
  },
};
