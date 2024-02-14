import { dbClient, dbSchema } from "@/db";
import { ENDPOINT_FUNCTION } from "@/endpoint";
import { logger } from "@/utils/log";
import { nullGuard } from "@/utils/type";
import ConcurrentManager from "concurrent-manager";
import { eq, inArray } from "drizzle-orm";

export const getTpsDetail = async () => {
  const listTps = await dbClient.query.wilayah.findMany({
    where: (table, { eq, and }) =>
      and(eq(table.tingkat, 5), eq(table.is_fetched, false)),
    // limit: 1000,
  });
  const count = listTps.length;

  logger.info(`Successfully queried data for TPS: ${listTps.length} rows`);

  const concurrent = new ConcurrentManager({
    concurrent: 500,
  });

  for (let i = 0; i < listTps.length; i++) {
    concurrent.queue(async () => {
      const tps = listTps[i];

      const response = await ENDPOINT_FUNCTION.pilpres.wilayah.get_detail_tps(
        tps.kode,
      );

      logger.info(
        `${i + 1}/${count} - Successfully fetched data for TPS: ${tps.kode}`,
      );

      const insert_and_update_is_fetched = await dbClient.transaction(
        async (trx) => {
          const insert = await trx.insert(dbSchema.ppwpTps).values({
            kode: tps.kode,
            provinsi: tps.kode.substring(0, 2),
            kabupaten_kota: tps.kode.substring(0, 4),
            kecamatan: tps.kode.substring(0, 6),
            kelurahan_desa: tps.kode.substring(0, 10),
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
              is_fetched: true,
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

export const getTpsDetailV2 = async () => {
  const listTps = await dbClient.query.wilayah.findMany({
    where: (table, { eq, and }) =>
      and(eq(table.tingkat, 5), eq(table.is_fetched, false)),
  });
  const count = listTps.length;

  logger.info(`Successfully queried data for TPS: ${count} rows`);

  const concurrent = new ConcurrentManager({
    concurrent: 20,
  });

  const batching = 50;
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
      const getTpsDetail = ENDPOINT_FUNCTION.pilpres.wilayah.get_detail_tps;
      const bucketResponse = [] as Array<
        Awaited<ReturnType<typeof getTpsDetail>> & {
          kode: string;
        }
      >;

      for (const tps of singleBatch) {
        const response = await getTpsDetail(tps.kode);

        bucketResponse.push({ ...response, kode: tps.kode });
      }

      const insert_and_update_is_fetched = await dbClient.transaction(
        async (trx) => {
          const insert = await trx.insert(dbSchema.ppwpTps).values(
            bucketResponse.map((response, i) => {
              return {
                kode: response.kode,
                provinsi: response.kode.substring(0, 2),
                kabupaten_kota: response.kode.substring(0, 4),
                kecamatan: response.kode.substring(0, 6),
                kelurahan_desa: response.kode.substring(0, 10),
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
              is_fetched: true,
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
