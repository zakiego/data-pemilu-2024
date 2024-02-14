import { z } from "zod";

export const dprdKabupatenKota = {
  // wilayah: SAME AS pilpres.wilayah.list_provinsi
  dapil: (id: string) =>
    `https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/pdprdk/${id.substring(
      0,
      2,
    )}/${id}.json`,
};
