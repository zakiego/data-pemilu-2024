import { dbClient, dbSchema } from "@/db";
import { ENDPOINT_FUNCTION } from "@/endpoint";
import { options } from "@/index";
import { createConcurrentManager } from "@/utils/concurrent";
import { logger } from "@/utils/log";
import { initCli } from "@/utils/progress";
import { eq, sql, asc } from "drizzle-orm";

const QUERY_TPS = dbClient.query.pdpdTpsList;
const SCHEMA_DAPIL_CALON_LIST = dbSchema.pdpdCalonList;
const SCHEMA_TPS_LIST = dbSchema.pdpdTpsList;
const SCHEMA_TPS_CHART = dbSchema.pdpdTpsChart;
const SCHEMA_TPS_ADMINISTRASI = dbSchema.pdpdTpsAdministrasi;
const FECTH_TPS = ENDPOINT_FUNCTION.dpd.getTpsDetail;
const FETCH_DAPIL_CALON_LIST = ENDPOINT_FUNCTION.dpd.getDapilCalonList;

const COLUMN_IS_FETCHED = dbSchema.wilayah.is_fetched_dpd;

const initTpsList = async () => {
  await dbClient.execute(sql`
  INSERT INTO ${SCHEMA_TPS_LIST} (id, kode, nama, tingkat, updated_at, created_at)
  SELECT id, kode, nama, tingkat, updated_at, created_at
  FROM ${dbSchema.wilayah}
  WHERE tingkat = 5
  ON CONFLICT (kode) DO NOTHING
  `);

  logger.info("Successfully inserted TPS list");

  process.exit(0);
};

const getCalonList = async () => {
  const listDapil = await dbClient.query.wilayah.findMany({
    where: (table, { eq, and }) => and(eq(table.tingkat, 1)),
    columns: {
      kode: true,
    },
    limit: options.limit,
  });

  const count = listDapil.length;

  logger.info(`Successfully queried data for Dapil: ${count} rows`);

  const concurrent = createConcurrentManager();

  for (let i = 0; i < count; i++) {
    concurrent.queue(async () => {
      const dapil = listDapil[i];
      const orderId = `${i + 1}/${count}`;

      const response = await FETCH_DAPIL_CALON_LIST(dapil.kode);

      logger.info(
        `${orderId} - Successfully fetched data for Dapil: ${dapil.kode}`,
      );

      const insert_and_update_is_fetched = await dbClient.transaction(
        async (trx) => {
          const insert = await trx
            .insert(SCHEMA_DAPIL_CALON_LIST)
            .values(response)
            .onConflictDoUpdate({
              target: SCHEMA_DAPIL_CALON_LIST.calon_id,
              set: {
                nama: sql`EXCLUDED.nama`,
                nomor_urut: sql`EXCLUDED.nomor_urut`,
                jenis_kelamin: sql`EXCLUDED.jenis_kelamin`,
                tempat_tinggal: sql`EXCLUDED.tempat_tinggal`,
              },
            })
            .returning();

          const update_is_fetched = await trx
            .update(dbSchema.wilayah)
            .set({
              is_fetched_dpd: true,
            })
            .where(eq(dbSchema.wilayah.kode, dapil.kode));

          return insert;
        },
      );

      logger.info(
        `${i + 1}/${count} - Successfully inserted data for Dapil: ${
          dapil.kode
        } with ${insert_and_update_is_fetched.length} rows`,
      );
    });
  }

  await concurrent.run();

  process.exit(0);
};

const getTpsDetail = async () => {
  const listTPS = await QUERY_TPS.findMany({
    columns: {
      kode: true,
    },
    limit: options.limit,
    orderBy: asc(SCHEMA_TPS_LIST.updated_at),
  });

  const count = listTPS.length;

  logger.info(`Successfully queried data for TPS: ${listTPS.length} rows`);

  const concurrent = createConcurrentManager();

  const cli = initCli({
    total: count,
  });

  for (let i = 0; i < listTPS.length; i++) {
    concurrent.queue(async () => {
      const tps = listTPS[i];
      const orderId = `${i + 1}/${count}`;

      const response = await FECTH_TPS(tps.kode);

      logger.info(
        `${orderId} - Successfully fetched data for TPS: ${tps.kode}`,
      );

      const insert_and_update = await dbClient.transaction(async (trx) => {
        if (response.suara.length > 0) {
          // --- Insert TPS Chart
          await dbClient
            .insert(SCHEMA_TPS_CHART)
            .values(
              response.suara.map((suara) => ({
                calon_id: suara.calon_id,
                tps: tps.kode,
                jumlah_suara: suara.jumlah_suara,
                ts: response.ts,
              })),
            )
            .onConflictDoUpdate({
              target: [SCHEMA_TPS_CHART.tps, SCHEMA_TPS_CHART.calon_id],
              set: {
                jumlah_suara: sql`EXCLUDED.jumlah_suara`,
                ts: sql`EXCLUDED.ts`,
                fetch_count: sql`${SCHEMA_TPS_CHART.fetch_count} + 1`,
                updated_at: new Date(),
              },
            })
            .catch((e) => {
              console.log("Error on insert TPS Chart", e);
              throw e;
            });
        }

        // --- Insert TPS Administrasi
        await trx
          .insert(SCHEMA_TPS_ADMINISTRASI)
          .values({
            tps: tps.kode,

            images: response.images.map((image) => image ?? ""),
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
            ts: response.ts,
            psu: response.psu,

            created_at: new Date(),
            updated_at: new Date(),
          })
          .onConflictDoUpdate({
            target: SCHEMA_TPS_ADMINISTRASI.tps,
            set: {
              images: response.images.map((image) => image ?? ""),
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
              ts: response.ts,
              psu: response.psu,

              fetch_count: sql`${SCHEMA_TPS_ADMINISTRASI.fetch_count} + 1`,
              updated_at: new Date(),
            },
          })
          .catch((e) => {
            console.log("Error on insert TPS Administrasi", e);
            throw e;
          });

        // --- Update TPS List
        await trx
          .update(SCHEMA_TPS_LIST)
          .set({
            updated_at: new Date(),
            fetch_count: sql`${SCHEMA_TPS_LIST.fetch_count} + 1`,
          })
          .where(eq(SCHEMA_TPS_LIST.kode, tps.kode))
          .catch((e) => {
            console.log("Error on update TPS List", e);
            throw e;
          });

        cli.increment();
      });

      logger.info(
        `${orderId} - Successfully updated data for TPS: ${tps.kode}`,
      );
    });
  }

  await concurrent.run();

  process.exit(0);
};

export const dpdActions = {
  initTpsList,
  getCalonList,
  getTpsDetail,
};
