import { and, eq } from "drizzle-orm";
import z from "zod";
import { dbClient, dbSchema } from "@/db";
import { logger } from "@/utils/log";
import { ENDPOINT_FUNCTION } from "@/endpoint";
import { options } from "@/index";
import { createConcurrentManager } from "@/utils/concurrent";

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
    where: (table, { eq, and }) =>
      and(eq(table.tingkat, 1), eq(table.is_fetched_wilayah, false)),
  });
  const count = listProvinsi.length;

  logger.info(`Successfully queried data for kabupaten: ${count} rows`);

  for (let i = 0; i < listProvinsi.length; i++) {
    const provinsi = listProvinsi[i];

    const endpoint = `https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${provinsi.kode}.json`;

    const response = await wilayahFetcher(endpoint);
    logger.info(
      `${i + 1}/${count} - Successfully fetched data for kabupaten: ${
        response.length
      } rows`,
    );

    const insert_and_update_is_fetched = await dbClient.transaction(
      async (trx) => {
        const insert = await trx
          .insert(dbSchema.wilayah)
          .values(response)
          .onConflictDoNothing()
          .returning();

        const update_is_fetched = await trx
          .update(dbSchema.wilayah)
          .set({
            is_fetched_wilayah: true,
            updated_at: new Date(),
          })
          .where(eq(dbSchema.wilayah.kode, provinsi.kode));

        return insert;
      },
    );

    logger.info(
      `${i + 1}/${count} - Inserting data for kabupaten: ${
        insert_and_update_is_fetched.length
      } rows`,
    );
  }
};

const getKecamatan = async () => {
  const listKabupatenKota = await dbClient.query.wilayah.findMany({
    where: (table, { eq, and }) =>
      and(eq(table.tingkat, 2), eq(table.is_fetched_wilayah, false)),
  });
  const count = listKabupatenKota.length;
  logger.info(`Successfully queried data for kecamatan: ${count} rows`);

  const concurrent = createConcurrentManager();

  for (let i = 0; i < listKabupatenKota.length; i++) {
    concurrent.queue(async () => {
      const kabupatenKota = listKabupatenKota[i];

      const provinsiId = kabupatenKota.kode.substring(0, 2);
      const endpoint = `https://sirekap-obj-data.kpu.go.id/wilayah/pemilu/ppwp/${provinsiId}/${kabupatenKota.kode}.json`;

      const response = await wilayahFetcher(endpoint);
      logger.info(
        `${i + 1}/${count} - Successfully fetched data for kecamatan: ${
          response.length
        } rows`,
      );

      const insert_and_update_is_fetched = await dbClient.transaction(
        async (trx) => {
          const insert = await trx
            .insert(dbSchema.wilayah)
            .values(response)
            .onConflictDoNothing()
            .returning();

          const update_is_fetched = await trx
            .update(dbSchema.wilayah)
            .set({
              is_fetched_wilayah: true,
              updated_at: new Date(),
            })
            .where(eq(dbSchema.wilayah.kode, kabupatenKota.kode));

          return insert;
        },
      );

      logger.info(
        `${i + 1}/${count} - Inserting data for kecamatan: ${
          insert_and_update_is_fetched.length
        } rows`,
      );
    });
  }

  await concurrent.run();
};

const getKelurahan = async () => {
  const listKecamatan = await dbClient.query.wilayah.findMany({
    where: (table, { eq, and }) =>
      and(eq(table.tingkat, 3), eq(table.is_fetched_wilayah, false)),
  });
  const count = listKecamatan.length;

  const concurrent = createConcurrentManager();

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
        } - Successfully fetched data for kelurahan: ${response.length} rows`,
      );

      const insert_and_update_is_fetched = await dbClient.transaction(
        async (trx) => {
          const insert = await trx
            .insert(dbSchema.wilayah)
            .values(response)
            .onConflictDoNothing()
            .returning();

          const update_is_fetched = await trx
            .update(dbSchema.wilayah)
            .set({
              is_fetched_wilayah: true,
              updated_at: new Date(),
            })
            .where(eq(dbSchema.wilayah.kode, kecamatan.kode));

          return insert;
        },
      );

      logger.info(
        `${i + 1}/${count} - Inserting data for kelurahan: ${
          insert_and_update_is_fetched.length
        } rows`,
      );
    });
  }

  await concurrent.run();
};

const getTPS = async () => {
  const listKelurahan = await dbClient.query.wilayah.findMany({
    where: (table, { eq, and }) =>
      and(eq(table.tingkat, 4), eq(table.is_fetched_wilayah, false)),
  });
  const count = listKelurahan.length;

  logger.info(
    `Successfully queried data for TPS: ${listKelurahan.length} rows`,
  );

  const concurrent = createConcurrentManager();

  for (let i = 0; i < listKelurahan.length; i++) {
    concurrent.queue(async () => {
      const kelurahan = listKelurahan[i];

      const response = await ENDPOINT_FUNCTION.wilayah.get_list_tps(
        kelurahan.kode,
      );

      logger.info(
        `${i + 1}/${count} - Successfully fetched data for TPS: ${
          response.length
        } rows`,
      );

      const insert_and_update_is_fetched = await dbClient.transaction(
        async (trx) => {
          const insert = await trx
            .insert(dbSchema.wilayah)
            .values(response)
            .onConflictDoNothing()
            .returning();

          const update_is_fetched = await trx
            .update(dbSchema.wilayah)
            .set({
              is_fetched_wilayah: true,
              updated_at: new Date(),
            })
            .where(eq(dbSchema.wilayah.kode, kelurahan.kode));

          return insert;
        },
      );

      logger.info(
        `${i + 1}/${count} - Inserting data for TPS: ${
          insert_and_update_is_fetched.length
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

  process.exit(0);
};
