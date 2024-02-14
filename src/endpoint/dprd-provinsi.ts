import { z } from "zod";

export const dprdProvinsi = {
	// wilayah: SAME AS pilpres.wilayah.list_provinsi
	dapil: {
		url: (id: string) =>
			`https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/pdprdp/${id}.json`,
	},
};
