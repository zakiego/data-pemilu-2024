import { psuEnum } from "@/endpoint/schema";
import { strictFetch } from "@/utils/fetch";
import { filter, flatten } from "lodash";
import { z } from "zod";

export const dpr = {
  getDapilCalonList: async (dapilId: string) => {
    if (dapilId.length !== 4) {
      throw new Error("Invalid Dapil ID");
    }

    const url = `https://sirekap-obj-data.kpu.go.id/pemilu/caleg/partai/${dapilId}.json`;

    const schema = z.record(
      z.string(),
      z.record(
        z.string(),
        z
          .object({
            nama: z.string(),
            nomor_urut: z.number(),
            jenis_kelamin: z.enum(["L", "P"]),
            tempat_tinggal: z.string(),
          })
          .strict(),
      ),
    );

    const response = await strictFetch(url, schema);

    // const flat = Object.entries(response).map(([calonId, calon]) => {
    //   return {
    //     ...calon,
    //     dapil_kode: dapilId,
    //     calon_id: calonId,
    //   };
    // });

    const flat = Object.entries(response).map(([partaiId, value]) => {
      return Object.entries(value).map(([calonId, value]) => {
        const { nomor_urut, ...rest } = value;

        return {
          ...rest,
          dapil_kode: dapilId,
          calon_id: calonId,
          partai_id: partaiId,
          nomor_urut: value.nomor_urut,
        };
      });
    });

    return flatten(flat);
  },

  getTpsDetail: async (id: string) => {
    if (id.length !== 13) {
      throw new Error("Invalid TPS ID");
    }

    const url = `https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/pdpr/${id.substring(
      0,
      2,
    )}/${id.substring(0, 4)}/${id.substring(0, 6)}/${id.substring(
      0,
      10,
    )}/${id}.json`;

    const schema = z
      .object({
        chart: z
          .record(
            z.string(),
            z.object(
              {
                jml_suara_total: z.number(),
                jml_suara_partai: z.number(),
              },
            ),
          )
          .nullable(),
        kode_dapil: z.string().nullish(),
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
        caleg: z
          .record(
            z.string(), // nomor partai
            z.record(
              z.string(), // nomor caleg
              z.number().nullable(),
            ),
          )
          .nullish(),
        psu: psuEnum.nullable(),
        ts: z.string(),
        status_suara: z.boolean(),
        status_adm: z.boolean(),
      })
      .strict();

    const response = await strictFetch(url, schema);

    const flatSuaraPartai =
      response.chart &&
      Object.entries(response.chart).map(([partaiId, jumlahSuara]) => {
        return {
          partai_id: partaiId,
          tps: id,
          jumlah_suara_total: jumlahSuara.jml_suara_total,
          jumlah_suara_partai: jumlahSuara.jml_suara_partai,
        };
      });

    const flatSuaraCaleg =
      response.caleg &&
      flatten(
        Object.entries(response.caleg).map(([partaiId, value]) => {
          return Object.entries(value).map(([calonId, value]) => {
            if (calonId === "null") return;

            return {
              calon_id: calonId,
              partai_id: partaiId,
              tps: id,
              jumlah_suara: value,
            };
          });
        }),
      );

    const filteredFlatSuaraCaleg = filter(
      flatSuaraCaleg,
      (suara) => suara !== undefined,
    ) as unknown as {
      calon_id: string;
      partai_id: string;
      tps: string;
      jumlah_suara: number;
    }[];

    return {
      ...response,
      suaraCaleg: filteredFlatSuaraCaleg,
      suaraPartai: flatSuaraPartai,
    };
  },
  //   getDapilList: async () => {
  //     const url =
  //       "https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/pdpr/dapil_dpr.json";
  //     const schema = z.array(
  //       z.object({
  //         id: z.number(),
  //         nama: z.string(),
  //         kode: z.string(),
  //       }),
  //     );
  //     const data = await strictFetch(url, schema);
  //     return data;
  //   },
  //   getDapilCalonList: async (id: string) => {
  //     const urlProfilCaleg = `https://sirekap-obj-data.kpu.go.id/pemilu/caleg/partai/${id}.json`;
  //     const schemaProfilCaleg = z.record(
  //       z.string(),
  //       z.record(
  //         z.string(),
  //         z
  //           .object({
  //             nama: z.string(),
  //             nomor_urut: z.number(),
  //             jenis_kelamin: z.enum(["L", "P"]),
  //             tempat_tinggal: z.string(),
  //           })
  //           .strict(),
  //       ),
  //     );
  //     const dataCaleg = await strictFetch(urlProfilCaleg, schemaProfilCaleg);

  //     const flattenCaleg = flatten(
  //       Object.entries(dataCaleg).map(([keyPartai, value]) => {
  //         return Object.entries(value).map(([keyCalon, value]) => {
  //           const { nomor_urut, ...rest } = value;

  //           return {
  //             ...rest,
  //             dapil_kode: id,
  //             calon_id: keyCalon,
  //             partai_id: keyPartai,
  //             nomor_urut_calon_di_partai: value.nomor_urut,
  //           };
  //         });
  //       }),
  //     );

  //     return flattenCaleg;
  //   },
  //   getDapilCalonDetail: async (id: string) => {
  //     const urlHhcw = `https://sirekap-obj-data.kpu.go.id/pemilu/hhcd/pdpr/${id}.json`;
  //     const schemaHhcw = z
  //       .object({
  //         ts: z.string(),
  //         mode: z.enum(["hhcw"]),
  //         chart: z.record(z.coerce.number().or(z.enum(["persen"])), z.number()),
  //         progres: z.record(z.enum(["total", "progres"]), z.number()),
  //         table: z.record(
  //           z.string(),
  //           z.record(
  //             z.coerce
  //               .number()
  //               .or(z.enum(["jml_suara_total", "jml_suara_partai"])),
  //             z.number(),
  //           ),
  //         ),
  //       })
  //       .strict();

  //     const dataHhcw = await strictFetch(urlHhcw, schemaHhcw);

  //     const flattenHhcw = flatten(
  //       Object.entries(dataHhcw.table).map(([keyPartai, value]) => {
  //         return Object.entries(value).map(([keyCalon, value]) => {
  //           if (
  //             keyCalon === "jml_suara_total" ||
  //             keyCalon === "jml_suara_partai"
  //           ) {
  //             return undefined;
  //           }

  //           return {
  //             calon_id: keyCalon,
  //             jumlah_suara: value,
  //             ts: dataHhcw.ts,
  //             dapil_kode: id,
  //           };
  //         });
  //       }),
  //     );

  //     return flattenHhcw;
  //   },
};

// export const dpr = {
//   getPartai: async () => {
//     const url = "https://sirekap-obj-data.kpu.go.id/pemilu/partai.json";

//     const schema = z.record(
//       z.string(),
//       z
//         .object({
//           ts: z.string(),
//           id_partai: z.number(),
//           id_pilihan: z.number(),
//           is_aceh: z.boolean(),
//           nama: z.string(),
//           nama_lengkap: z.string(),
//           nomor_urut: z.number(),
//           warna: z.string(),
//         })
//         .strict(),
//     );

//     const data = await strictFetch(url, schema);

//     return data;
//   },
// };
