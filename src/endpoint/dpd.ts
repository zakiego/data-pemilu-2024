import { z } from "zod";

export const dpd = {
	calon: {
		url: (id: string) =>
			`https://sirekap-obj-data.kpu.go.id/pemilu/caleg/dpd/${id}.json`,
		schema: z.array(
			z
				.object({
					jenis_kelamin: z.enum(["L", "P"]),
					nama: z.string(),
					nomor_urut: z.number(),
					tempat_tinggal: z.string(),
				})
				.strict(),
		),
	},
	// hitung_suara: {
	// 	url: (id: string) => {
	// 		if (id.length !== 6) throw new Error("ID must be 6 characters");

	// 		const schema = z.object({
	// 			chart: z.any(), // TODO: Add schema
	// 			progres: z.object({
	// 				progres: z.number(),
	// 				total: z.number(),
	// 			}),
	// 			psu: z.enum(["Reguler"]),
	// 			table: z.record(
	// 				z.object({
	// 					psu: z.enum(["Reguler"]),
	// 					persen: z.number(),
	// 					status_progress: z.boolean(),
	// 				}),
	// 			),
	// 			ts: z.string(),
	// 		});

	// 		const endpoint = `https://sirekap-obj-data.kpu.go.id/pemilu/hhcw/pdpd/${id.substring(
	// 			0,
	// 			2,
	// 		)}/${id.substring(0, 4)}/${id}.json`;

	// 		return strictFetch(endpoint, schema);
	// 	},
	// },
};
