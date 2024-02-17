import { strictFetch } from "@/utils/fetch";
import { z } from "zod";

export const partai = {
  getPartaiList: async () => {
    const url = "https://sirekap-obj-data.kpu.go.id/pemilu/partai.json";
    const schema = z.record(
      z.string(),
      z
        .object({
          ts: z.string(),
          id_partai: z.number(),
          id_pilihan: z.number(),
          is_aceh: z.boolean(),
          nama: z.string(),
          nama_lengkap: z.string(),
          nomor_urut: z.number(),
          warna: z.string(),
        })
        .strict(),
    );

    const data = await strictFetch(url, schema);
    return data;
  },
};
