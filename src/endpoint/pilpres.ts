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
	},
};
