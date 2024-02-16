import { dbClient, dbSchema } from "@/db";
import { ENDPOINT_FUNCTION } from "@/endpoint";
import { options } from "@/index";
import { createConcurrentManager } from "@/utils/concurrent";
import { logger } from "@/utils/log";
import { nullGuard } from "@/utils/type";
import { eq, inArray, or, sql } from "drizzle-orm";

const QUERY = dbClient.query.ppwpTps;
const TPS_SCHEMA = dbSchema.ppwpTps;
const FETCH_TPS = ENDPOINT_FUNCTION.presiden.get_detail_tps;
const COLUMN_IS_FETCHED = dbSchema.wilayah.is_fetched_presiden;

const insertTpsDetail = async () => {
  const listTps = await dbClient.query.wilayah.findMany({
    where: (table, { eq, and }) =>
      and(eq(table.tingkat, 5), eq(COLUMN_IS_FETCHED, false)),
    limit: options.limit,
  });
  const count = listTps.length;

  logger.info(`Successfully queried data for TPS: ${listTps.length} rows`);

  const concurrent = createConcurrentManager();

  for (let i = 0; i < listTps.length; i++) {
    concurrent.queue(async () => {
      const tps = listTps[i];

      const response = await FETCH_TPS(tps.kode);

      logger.info(
        `${i + 1}/${count} - Successfully fetched data for TPS: ${tps.kode}`,
      );

      const insert_and_update_is_fetched = await dbClient.transaction(
        async (trx) => {
          const insert = await trx.insert(dbSchema.ppwpTps).values({
            kode: tps.kode,
            provinsi_kode: tps.kode.substring(0, 2),
            kabupaten_kota_kode: tps.kode.substring(0, 4),
            kecamatan_kode: tps.kode.substring(0, 6),
            kelurahan_desa_kode: tps.kode.substring(0, 10),
            tps: tps.kode.substring(10, 13),
            suara_paslon_1: nullGuard(response.chart?.["100025"]),
            suara_paslon_2: nullGuard(response.chart?.["100026"]),
            suara_paslon_3: nullGuard(response.chart?.["100027"]),
            chasil_1: response.images[0],
            chasil_2: response.images[1],
            chasil_3: response.images[2],
            suara_sah: response.administrasi?.suara_sah,
            suara_total: response.administrasi?.suara_total,
            pemilih_dpt_j: response.administrasi?.pemilih_dpt_j,
            pemilih_dpt_l: response.administrasi?.pemilih_dpt_l,
            pemilih_dpt_p: response.administrasi?.pemilih_dpt_p,
            pengguna_dpt_j: response.administrasi?.pengguna_dpt_j,
            pengguna_dpt_l: response.administrasi?.pengguna_dpt_l,
            pengguna_dpt_p: response.administrasi?.pengguna_dpt_p,
            pengguna_dptb_j: response.administrasi?.pengguna_dptb_j,
            pengguna_dptb_l: response.administrasi?.pengguna_dptb_l,
            pengguna_dptb_p: response.administrasi?.pengguna_dptb_p,
            suara_tidak_sah: response.administrasi?.suara_tidak_sah,
            pengguna_total_j: response.administrasi?.pengguna_total_j,
            pengguna_total_l: response.administrasi?.pengguna_total_l,
            pengguna_total_p: response.administrasi?.pengguna_total_p,
            pengguna_non_dpt_j: response.administrasi?.pengguna_non_dpt_j,
            pengguna_non_dpt_l: response.administrasi?.pengguna_non_dpt_l,
            pengguna_non_dpt_p: response.administrasi?.pengguna_non_dpt_p,
            psu: response.psu,
            ts: response.ts,
            status_suara: response.chart !== null,
            status_adm: response.administrasi !== null,
            updated_at: new Date(),
            created_at: new Date(),
          });

          const update_is_fetched = await trx
            .update(dbSchema.wilayah)
            .set({
              is_fetched_presiden: true, // !!ADJUST THIS!!
              updated_at: new Date(),
            })
            .where(eq(dbSchema.wilayah.kode, tps.kode));

          return insert;
        },
      );

      logger.info(
        `${i + 1}/${count} - Successfully inserted data for TPS: ${tps.kode}`,
      );
    });
  }

  await concurrent.run();

  process.exit(0);
};

const insertTpsDetailV2 = async () => {
  const listTps = await dbClient.query.wilayah.findMany({
    where: (table, { eq, and }) =>
      and(eq(table.tingkat, 5), eq(COLUMN_IS_FETCHED, false)),
    limit: options.limit,
  });
  const count = listTps.length;

  logger.info(`Successfully queried data for TPS: ${count} rows`);

  const concurrent = createConcurrentManager();

  const batching = 100;
  const batch = [] as (typeof listTps)[];

  // push tps to batch
  for (let i = 0; i < listTps.length; i++) {
    // push every 10 tps to batch
    if (i % batching === 0) {
      batch.push(listTps.slice(i, i + batching));
    }
  }

  const countBatch = batch.length;

  // loop through batch
  for (let i = 0; i < countBatch; i++) {
    concurrent.queue(async () => {
      const singleBatch = batch[i];

      const bucketResponse = [] as Array<
        Awaited<ReturnType<typeof FETCH_TPS>> & {
          kode: string;
        }
      >;

      for (const tps of singleBatch) {
        const response = await FETCH_TPS(tps.kode);

        bucketResponse.push({ ...response, kode: tps.kode });
      }

      const insert_and_update_is_fetched = await dbClient.transaction(
        async (trx) => {
          const insert = await trx.insert(dbSchema.ppwpTps).values(
            bucketResponse.map((response, i) => {
              return {
                kode: response.kode,
                provinsi_kode: response.kode.substring(0, 2),
                kabupaten_kota_kode: response.kode.substring(0, 4),
                kecamatan_kode: response.kode.substring(0, 6),
                kelurahan_desa_kode: response.kode.substring(0, 10),
                tps: response.kode.substring(10, 13),
                suara_paslon_1: nullGuard(response.chart?.["100025"]),
                suara_paslon_2: nullGuard(response.chart?.["100026"]),
                suara_paslon_3: nullGuard(response.chart?.["100027"]),
                chasil_1: response.images[0],
                chasil_2: response.images[1],
                chasil_3: response.images[2],
                suara_sah: response.administrasi?.suara_sah,
                suara_total: response.administrasi?.suara_total,
                pemilih_dpt_j: response.administrasi?.pemilih_dpt_j,
                pemilih_dpt_l: response.administrasi?.pemilih_dpt_l,
                pemilih_dpt_p: response.administrasi?.pemilih_dpt_p,
                pengguna_dpt_j: response.administrasi?.pengguna_dpt_j,
                pengguna_dpt_l: response.administrasi?.pengguna_dpt_l,
                pengguna_dpt_p: response.administrasi?.pengguna_dpt_p,
                pengguna_dptb_j: response.administrasi?.pengguna_dptb_j,
                pengguna_dptb_l: response.administrasi?.pengguna_dptb_l,
                pengguna_dptb_p: response.administrasi?.pengguna_dptb_p,
                suara_tidak_sah: response.administrasi?.suara_tidak_sah,
                pengguna_total_j: response.administrasi?.pengguna_total_j,
                pengguna_total_l: response.administrasi?.pengguna_total_l,
                pengguna_total_p: response.administrasi?.pengguna_total_p,
                pengguna_non_dpt_j: response.administrasi?.pengguna_non_dpt_j,
                pengguna_non_dpt_l: response.administrasi?.pengguna_non_dpt_l,
                pengguna_non_dpt_p: response.administrasi?.pengguna_non_dpt_p,
                psu: response.psu,
                ts: response.ts,
                status_suara: response.chart !== null,
                status_adm: response.administrasi !== null,
                updated_at: new Date(),
                created_at: new Date(),
              };
            }),
          );

          const update_is_fetched = await trx
            .update(dbSchema.wilayah)
            .set({
              is_fetched_presiden: true, // !!ADJUST THIS!!
              updated_at: new Date(),
            })
            .where(
              inArray(
                dbSchema.wilayah.kode,
                singleBatch.map((x) => x.kode),
              ),
            );
        },
      );

      logger.info(
        `${
          i + 1
        }/${countBatch} - Successfully inserted data for TPS: ${singleBatch
          .map((x) => x.kode)
          .join(", ")}`,
      );
    });
  }

  await concurrent.run();

  process.exit(0);
};

const updateTpsDetail = async () => {
  const listTps = await dbClient.query.ppwpTps.findMany({
    orderBy: (table, { asc }) => asc(table.updated_at),
    columns: {
      kode: true,
    },
    limit: options.limit,
  });
  const count = listTps.length;

  logger.info(`Successfully queried data for TPS: ${listTps.length} rows`);

  const concurrent = createConcurrentManager();

  for (let i = 0; i < listTps.length; i++) {
    concurrent.queue(async () => {
      const tps = listTps[i];

      const response = await FETCH_TPS(tps.kode);

      logger.info(
        `${i + 1}/${count} - Successfully fetched data for TPS: ${tps.kode}`,
      );

      const insert_and_update_is_fetched = await dbClient.transaction(
        async (trx) => {
          // const insert = await trx.insert(dbSchema.ppwpTps).values({
          //   kode: tps.kode,
          //   provinsi_kode: tps.kode.substring(0, 2),
          //   kabupaten_kota_kode: tps.kode.substring(0, 4),
          //   kecamatan_kode: tps.kode.substring(0, 6),
          //   kelurahan_desa_kode: tps.kode.substring(0, 10),
          //   tps: tps.kode.substring(10, 13),
          //   suara_paslon_1: nullGuard(response.chart?.["100025"]),
          //   suara_paslon_2: nullGuard(response.chart?.["100026"]),
          //   suara_paslon_3: nullGuard(response.chart?.["100027"]),
          //   chasil_1: response.images[0],
          //   chasil_2: response.images[1],
          //   chasil_3: response.images[2],
          //   suara_sah: response.administrasi?.suara_sah,
          //   suara_total: response.administrasi?.suara_total,
          //   pemilih_dpt_j: response.administrasi?.pemilih_dpt_j,
          //   pemilih_dpt_l: response.administrasi?.pemilih_dpt_l,
          //   pemilih_dpt_p: response.administrasi?.pemilih_dpt_p,
          //   pengguna_dpt_j: response.administrasi?.pengguna_dpt_j,
          //   pengguna_dpt_l: response.administrasi?.pengguna_dpt_l,
          //   pengguna_dpt_p: response.administrasi?.pengguna_dpt_p,
          //   pengguna_dptb_j: response.administrasi?.pengguna_dptb_j,
          //   pengguna_dptb_l: response.administrasi?.pengguna_dptb_l,
          //   pengguna_dptb_p: response.administrasi?.pengguna_dptb_p,
          //   suara_tidak_sah: response.administrasi?.suara_tidak_sah,
          //   pengguna_total_j: response.administrasi?.pengguna_total_j,
          //   pengguna_total_l: response.administrasi?.pengguna_total_l,
          //   pengguna_total_p: response.administrasi?.pengguna_total_p,
          //   pengguna_non_dpt_j: response.administrasi?.pengguna_non_dpt_j,
          //   pengguna_non_dpt_l: response.administrasi?.pengguna_non_dpt_l,
          //   pengguna_non_dpt_p: response.administrasi?.pengguna_non_dpt_p,
          //   psu: response.psu,
          //   ts: response.ts,
          //   status_suara: response.chart !== null,
          //   status_adm: response.administrasi !== null,
          //   updated_at: new Date(),
          //   created_at: new Date(),
          // });

          const update = await trx
            .update(dbSchema.ppwpTps)
            .set({
              suara_paslon_1: nullGuard(response.chart?.["100025"]),
              suara_paslon_2: nullGuard(response.chart?.["100026"]),
              suara_paslon_3: nullGuard(response.chart?.["100027"]),
              chasil_1: response.images[0],
              chasil_2: response.images[1],
              chasil_3: response.images[2],
              suara_sah: response.administrasi?.suara_sah,
              suara_total: response.administrasi?.suara_total,
              pemilih_dpt_j: response.administrasi?.pemilih_dpt_j,
              pemilih_dpt_l: response.administrasi?.pemilih_dpt_l,
              pemilih_dpt_p: response.administrasi?.pemilih_dpt_p,
              pengguna_dpt_j: response.administrasi?.pengguna_dpt_j,
              pengguna_dpt_l: response.administrasi?.pengguna_dpt_l,
              pengguna_dpt_p: response.administrasi?.pengguna_dpt_p,
              pengguna_dptb_j: response.administrasi?.pengguna_dptb_j,
              pengguna_dptb_l: response.administrasi?.pengguna_dptb_l,
              pengguna_dptb_p: response.administrasi?.pengguna_dptb_p,
              suara_tidak_sah: response.administrasi?.suara_tidak_sah,
              pengguna_total_j: response.administrasi?.pengguna_total_j,
              pengguna_total_l: response.administrasi?.pengguna_total_l,
              pengguna_total_p: response.administrasi?.pengguna_total_p,
              pengguna_non_dpt_j: response.administrasi?.pengguna_non_dpt_j,
              pengguna_non_dpt_l: response.administrasi?.pengguna_non_dpt_l,
              pengguna_non_dpt_p: response.administrasi?.pengguna_non_dpt_p,
              psu: response.psu,
              ts: response.ts,
              status_suara: response.chart !== null,
              status_adm: response.administrasi !== null,

              updated_at: new Date(),
              fetch_count: sql`${dbSchema.ppwpTps.fetch_count} + 1`,
            })
            .where(eq(dbSchema.ppwpTps.kode, tps.kode))
            .returning();

          return update;
        },
      );

      logger.info(
        `${i + 1}/${count} - Successfully updated data for TPS: ${tps.kode}`,
      );
    });
  }

  await concurrent.run();

  process.exit(0);
};

export const presidenActions = {
  insertTpsDetail,
  insertTpsDetailV2,
  updateTpsDetail,
};
