import ConcurrentManager from "concurrent-manager";
import { eq } from "drizzle-orm";
import z from "zod";
import { dbClient, dbSchema } from "@/db";
import { logger } from "@/utils/log";

const wilayahFetcher = async (endpoint: string) => {
	const response = await fetch(endpoint).then((res) => res.json());

	const schema = z.array(
		z.object({
			id: z.number(),
			kode: z.string(),
			nama: z.string(),
			tingkat: z.number(),
		}),
	);
	const parsedData = schema.safeParse(response);

	if (!parsedData.success) {
		logger.error("Invalid data", parsedData.error);
		throw new Error("Invalid data");
	}

	return parsedData.data;
};

const getProvinsi = async () => {
	const endpoint =
		"https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/0.json";

	const data = await wilayahFetcher(endpoint);
	logger.info(`Successfully fetched data for provinsi: ${data.length} rows`);

	const insert = await dbClient
		.insert(dbSchema.wilayah)
		.values(data)
		.onConflictDoNothing()
		.returning();
	logger.info(`Inserting data for provinsi: ${insert.length} rows`);
};

const getKabupatenKota = async () => {
	const listProvinsi = await dbClient.query.wilayah.findMany({
		where: (table, { eq }) => eq(table.tingkat, 1),
	});
	logger.info(
		`Successfully queried data for kabupaten: ${listProvinsi.length} rows`,
	);

	for (let i = 0; i < listProvinsi.length; i++) {
		const provinsi = listProvinsi[i];

		const endpoint = `https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${provinsi.kode}.json`;

		const response = await wilayahFetcher(endpoint);
		logger.info(
			`${i + 1}/${
				listProvinsi.length
			} - Successfully fetched data for kabupaten of provinsi: ${
				provinsi.nama
			} - ${response.length} rows`,
		);

		const insert = await dbClient
			.insert(dbSchema.wilayah)
			.values(response)
			.onConflictDoNothing()
			.returning();
		logger.info(
			`${i + 1}/${listProvinsi.length} - Inserting data for kabupaten: ${
				insert.length
			} rows`,
		);
	}
};

const getKecamatan = async () => {
	const listKabupatenKota = await dbClient.query.wilayah.findMany({
		where: (table, { eq }) => eq(table.tingkat, 2),
	});
	logger.info(
		`Successfully queried data for kecamatan: ${listKabupatenKota.length} rows`,
	);

	for (let i = 0; i < listKabupatenKota.length; i++) {
		const kabupatenKota = listKabupatenKota[i];

		const provinsiId = kabupatenKota.kode.substring(0, 2);
		const endpoint = `https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${provinsiId}/${kabupatenKota.kode}.json`;

		const response = await wilayahFetcher(endpoint);
		logger.info(
			`${i + 1}/${
				listKabupatenKota.length
			} - Successfully fetched data for kecamatan of kabupaten: ${
				kabupatenKota.nama
			} - ${response.length} rows`,
		);

		const insert = await dbClient
			.insert(dbSchema.wilayah)
			.values(response)
			.onConflictDoNothing()
			.returning();
		logger.info(
			`${i + 1}/${listKabupatenKota.length} - Inserting data for kecamatan: ${
				insert.length
			} rows`,
		);
	}
};

const getKelurahan = async () => {
	const listKecamatan = await dbClient.query.wilayah.findMany({
		where: (table, { eq }) => eq(table.tingkat, 3),
	});
	logger.info(
		`Successfully queried data for kelurahan: ${listKecamatan.length} rows`,
	);

	const concurrent = new ConcurrentManager({
		concurrent: 100,
	});

	for (let i = 0; i < listKecamatan.length; i++) {
		concurrent.queue(async () => {
			const kecamatan = listKecamatan[i];

			const provinsiId = kecamatan.kode.substring(0, 2);
			const kabupatenKotaId = kecamatan.kode.substring(0, 4);
			const endpoint = `https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${provinsiId}/${kabupatenKotaId}/${kecamatan.kode}.json`;
			const response = await wilayahFetcher(endpoint);
			logger.info(
				`${i + 1}/${
					listKecamatan.length
				} - Successfully fetched data for kelurahan of kecamatan: ${
					kecamatan.nama
				} - ${response.length} rows`,
			);

			const insert = await dbClient
				.insert(dbSchema.wilayah)
				.values(response)
				.onConflictDoNothing()
				.returning();
			logger.info(
				`${i + 1}/${listKecamatan.length} - Inserting data for kelurahan: ${
					insert.length
				} rows`,
			);
		});
	}

	await concurrent.run();
};

const getTPS = async () => {
	const listKelurahan = await dbClient.query.wilayah.findMany({
		where: (table, { eq }) => eq(table.tingkat, 4),
	});

	logger.info(
		`Successfully queried data for TPS: ${listKelurahan.length} rows`,
	);

	const concurrent = new ConcurrentManager({
		concurrent: 1000,
	});

	for (let i = 0; i < listKelurahan.length; i++) {
		concurrent.queue(async () => {
			const kelurahan = listKelurahan[i];

			const provinsiId = kelurahan.kode.substring(0, 2);
			const kabupatenKotaId = kelurahan.kode.substring(0, 4);
			const kecamatanId = kelurahan.kode.substring(0, 7);
			const endpoint = `https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${provinsiId}/${kabupatenKotaId}/${kecamatanId}/${kelurahan.kode}.json`;
			const response = await wilayahFetcher(endpoint);
			logger.info(
				`${i + 1}/${
					listKelurahan.length
				} - Successfully fetched data for TPS of kelurahan: ${
					kelurahan.nama
				} - ${response.length} rows`,
			);

			const insert = await dbClient
				.insert(dbSchema.wilayah)
				.values(response)
				.onConflictDoNothing()
				.returning();
			logger.info(
				`${i + 1}/${listKelurahan.length} - Inserting data for TPS: ${
					insert.length
				} rows`,
			);
		});
	}

	await concurrent.run();
};

export const getWilayah = async () => {
	await getProvinsi();
	await getKabupatenKota();
	await getKecamatan();
	await getKelurahan();
	await getTPS();
};
