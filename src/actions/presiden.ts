import { dbClient, dbSchema } from "@/db";
import { ENDPOINT_FUNCTION } from "@/endpoint";
import { options } from "@/index";
import { createConcurrentManager } from "@/utils/concurrent";
import { logger } from "@/utils/log";
import { initCli } from "@/utils/progress";
import { nullGuard } from "@/utils/type";
import { eq, inArray, sql } from "drizzle-orm";

const QUERY = dbClient.query.ppwpTps;
const TPS_SCHEMA = dbSchema.ppwpTps;
const FETCH_TPS = ENDPOINT_FUNCTION.presiden.get_detail_tps;
const COLUMN_IS_FETCHED = dbSchema.wilayah.is_fetched_presiden;

const getSuaraProvinsi = async () => {
  const response = await ENDPOINT_FUNCTION.presiden.get_suara_by_provinsi();
  const provinsi = await dbClient.query.wilayah.findMany({
    where: (table, { eq }) => eq(table.tingkat, 1),
    columns: {
      kode: true,
      nama: true,
    },
  });

  const cli = initCli({
    total: 2,
  });

  // -- Insert data to ppwp_nasional
  await dbClient
    .insert(dbSchema.ppwpNasional)
    .values({
      kode: "0",
      suara_paslon_1: response.data.chart["100025"],
      suara_paslon_2: response.data.chart["100026"],
      suara_paslon_3: response.data.chart["100027"],
      persen_suara_masuk: response.data.chart.persen,
      psu: response.data.psu,
      ts: response.data.ts,
      url_api: response.apiUrl,
      url_page: response.pageUrl,
    })
    .onConflictDoUpdate({
      target: [dbSchema.ppwpNasional.kode],
      set: {
        suara_paslon_1: sql`EXCLUDED.suara_paslon_1`,
        suara_paslon_2: sql`EXCLUDED.suara_paslon_2`,
        suara_paslon_3: sql`EXCLUDED.suara_paslon_3`,
        persen_suara_masuk: sql`EXCLUDED.persen_suara_masuk`,
        psu: response.data.psu,
        ts: response.data.ts,

        url_page: response.pageUrl,
        url_api: response.apiUrl,

        updated_at: new Date(),
        fetch_count: sql`${dbSchema.ppwpNasional.fetch_count} + 1`,
      },
    })
    .catch((e) => {
      logger.error(
        "Error on insert data: Hitung Suara - Presiden - Nasional",
        e,
      );
      throw e;
    });

  cli.increment();

  // -- Insert data to ppwp_provinsi
  await dbClient
    .insert(dbSchema.ppwpProvinsi)
    .values(
      response.data._flat_table.map((x) => {
        return {
          kode: x.provinsi,
          provinsi_kode: x.provinsi,
          provinsi_nama: provinsi.find((y) => y.kode === x.provinsi)?.nama,
          suara_paslon_1: x["100025"],
          suara_paslon_2: x["100026"],
          suara_paslon_3: x["100027"],
          status_progress: x.status_progress,
          psu: response.data.psu,
          ts: response.data.ts,
          fetch_count: 1,
          persen: x.persen,
        };
      }),
    )
    .onConflictDoUpdate({
      target: [dbSchema.ppwpProvinsi.kode],
      set: {
        suara_paslon_1: sql`EXCLUDED.suara_paslon_1`,
        suara_paslon_2: sql`EXCLUDED.suara_paslon_2`,
        suara_paslon_3: sql`EXCLUDED.suara_paslon_3`,
        persen: sql`EXCLUDED.persen`,
        status_progress: sql`EXCLUDED.status_progress`,
        psu: response.data.psu,
        ts: response.data.ts,
        updated_at: new Date(),
        fetch_count: sql`${dbSchema.ppwpProvinsi.fetch_count} + 1`,
      },
    })
    .catch((e) => {
      logger.error(
        "Error on insert data: Hitung Suara - Presiden - Provinsi",
        e,
      );
      throw e;
    });

  cli.increment();

  logger.info("Successfully inserted data: Hitung Suara - Presiden - Provinsi");

  process.exit(0);
};

const getSuaraKabupatenKota = async () => {
  const listProvinsi = await dbClient.query.wilayah.findMany({
    where: (table, { eq }) => eq(table.tingkat, 1),
    limit: options.limit,
    columns: {
      kode: true,
      nama: true,
    },
  });

  const listKabupatenKota = await dbClient.query.wilayah.findMany({
    where: (table, { eq }) => eq(table.tingkat, 2),
    columns: {
      kode: true,
      nama: true,
    },
  });

  const concurrent = createConcurrentManager();

  const cli = initCli({
    total: listProvinsi.length,
  });

  for (let i = 0; i < listProvinsi.length; i++) {
    concurrent.queue(async () => {
      const provinsi = listProvinsi[i];

      const response =
        await ENDPOINT_FUNCTION.presiden.get_suara_by_kabupaten_kota({
          provinsi_kode: provinsi.kode,
        });

      await dbClient
        .insert(dbSchema.ppwpKabupatenKota)
        .values(
          response.data._flat_table.map((x) => {
            const provinsi_kode = x.kabupaten_kota.substring(0, 2);
            const provinsi_nama = listProvinsi.find(
              (y) => y.kode === provinsi_kode,
            )?.nama;
            const kabupaten_kota_kode = x.kabupaten_kota;
            const kabupaten_kota_nama = listKabupatenKota.find(
              (y) => y.kode === kabupaten_kota_kode,
            )?.nama;

            return {
              kode: x.kabupaten_kota,
              provinsi_kode,
              provinsi_nama,
              kabupaten_kota_kode,
              kabupaten_kota_nama,
              suara_paslon_1: nullGuard(x["100025"]),
              suara_paslon_2: nullGuard(x["100026"]),
              suara_paslon_3: nullGuard(x["100027"]),
              status_progress: x.status_progress,
              psu: response.data.psu,
              ts: response.data.ts,

              url_page: response.pageUrl,
              url_api: response.apiUrl,

              fetch_count: 1,
              persen: x.persen,
            };
          }),
        )
        .onConflictDoUpdate({
          target: [dbSchema.ppwpKabupatenKota.kode],
          set: {
            suara_paslon_1: sql`EXCLUDED.suara_paslon_1`,
            suara_paslon_2: sql`EXCLUDED.suara_paslon_2`,
            suara_paslon_3: sql`EXCLUDED.suara_paslon_3`,
            persen: sql`EXCLUDED.persen`,
            status_progress: sql`EXCLUDED.status_progress`,
            psu: response.data.psu,
            ts: response.data.ts,

            url_page: response.pageUrl,
            url_api: response.apiUrl,
            updated_at: new Date(),
            fetch_count: sql`${dbSchema.ppwpKabupatenKota.fetch_count} + 1`,
          },
        })
        .catch((e) => {
          console.log(e);
          logger.error(
            "Error on insert data: Hitung Suara - Presiden - Kabupaten/Kota",
            e,
          );
          throw e;
        });

      cli.increment();
    });
  }

  await concurrent.run();

  logger.info(
    "Successfully inserted data: Hitung Suara - Presiden - Kabupaten/Kota",
  );

  process.exit(0);
};

const getSuaraKecamatan = async () => {
  const listProvinsi = await dbClient.query.wilayah.findMany({
    where: (table, { eq }) => eq(table.tingkat, 1),
    columns: {
      kode: true,
      nama: true,
    },
  });

  const listKabupatenKota = await dbClient.query.wilayah.findMany({
    where: (table, { eq }) => eq(table.tingkat, 2),
    limit: options.limit,
    columns: {
      kode: true,
      nama: true,
    },
  });

  const listKecamatan = await dbClient.query.wilayah.findMany({
    where: (table, { eq }) => eq(table.tingkat, 3),
    columns: {
      kode: true,
      nama: true,
    },
  });

  const concurrent = createConcurrentManager();

  const cli = initCli({
    total: listKabupatenKota.length,
  });

  for (let i = 0; i < listKabupatenKota.length; i++) {
    concurrent.queue(async () => {
      const kabupatenKota = listKabupatenKota[i];

      const response = await ENDPOINT_FUNCTION.presiden.get_suara_by_kecamatan({
        kabupaten_kode: kabupatenKota.kode,
      });

      await dbClient
        .insert(dbSchema.ppwpKecamatan)
        .values(
          response.data._flat_table.map((x) => {
            const provinsi_kode = x.kecamatan.substring(0, 2);
            const provinsi_nama = listProvinsi.find(
              (y) => y.kode === provinsi_kode,
            )?.nama;
            const kabupaten_kota_kode = x.kecamatan.substring(0, 4);
            const kabupaten_kota_nama = listKabupatenKota.find(
              (y) => y.kode === kabupaten_kota_kode,
            )?.nama;
            const kecamatan_kode = x.kecamatan;
            const kecamatan_nama = listKecamatan.find(
              (y) => y.kode === kecamatan_kode,
            )?.nama;

            return {
              kode: x.kecamatan,
              provinsi_kode,
              provinsi_nama,
              kabupaten_kota_kode,
              kabupaten_kota_nama,
              kecamatan_kode,
              kecamatan_nama,
              suara_paslon_1: nullGuard(x["100025"]),
              suara_paslon_2: nullGuard(x["100026"]),
              suara_paslon_3: nullGuard(x["100027"]),
              status_progress: x.status_progress,
              psu: response.data.psu,
              ts: response.data.ts,

              url_page: response.pageUrl,
              url_api: response.apiUrl,

              fetch_count: 1,
              persen: x.persen,
            };
          }),
        )
        .onConflictDoUpdate({
          target: [dbSchema.ppwpKecamatan.kode],
          set: {
            provinsi_kode: sql`EXCLUDED.provinsi_kode`,
            provinsi_nama: sql`EXCLUDED.provinsi_nama`,
            kabupaten_kota_kode: sql`EXCLUDED.kabupaten_kota_kode`,
            kabupaten_kota_nama: sql`EXCLUDED.kabupaten_kota_nama`,
            kecamatan_kode: sql`EXCLUDED.kecamatan_kode`,
            kecamatan_nama: sql`EXCLUDED.kecamatan_nama`,
            suara_paslon_1: sql`EXCLUDED.suara_paslon_1`,
            suara_paslon_2: sql`EXCLUDED.suara_paslon_2`,
            suara_paslon_3: sql`EXCLUDED.suara_paslon_3`,
            persen: sql`EXCLUDED.persen`,
            status_progress: sql`EXCLUDED.status_progress`,
            psu: response.data.psu,
            ts: response.data.ts,

            url_page: response.pageUrl,
            url_api: response.apiUrl,
            updated_at: new Date(),
            fetch_count: sql`${dbSchema.ppwpKecamatan.fetch_count} + 1`,
          },
        })
        .catch((e) => {
          console.log(e);
          logger.error(
            "Error on insert data: Hitung Suara - Presiden - Kecamatan",
            e,
          );
          throw e;
        });

      cli.increment();
    });
  }

  await concurrent.run();

  logger.info(
    "Successfully inserted data: Hitung Suara - Presiden - Kecamatan",
  );

  process.exit(0);
};

const getSuaraKelurahanDesa = async () => {
  const listProvinsi = await dbClient.query.wilayah.findMany({
    where: (table, { eq }) => eq(table.tingkat, 1),
    columns: {
      kode: true,
      nama: true,
    },
  });

  const listKabupatenKota = await dbClient.query.wilayah.findMany({
    where: (table, { eq }) => eq(table.tingkat, 2),
    limit: options.limit,
    columns: {
      kode: true,
      nama: true,
    },
  });

  const listKecamatan = await dbClient.query.wilayah.findMany({
    where: (table, { eq }) => eq(table.tingkat, 3),
    limit: options.limit,
    columns: {
      kode: true,
      nama: true,
    },
  });

  const listKelurahanDesa = await dbClient.query.wilayah.findMany({
    where: (table, { eq }) => eq(table.tingkat, 4),
    columns: {
      kode: true,
      nama: true,
    },
  });

  const concurrent = createConcurrentManager();

  const cli = initCli({
    total: listKecamatan.length,
  });

  for (let i = 0; i < listKecamatan.length; i++) {
    concurrent.queue(async () => {
      const kecamatan = listKecamatan[i];

      const response =
        await ENDPOINT_FUNCTION.presiden.get_suara_by_kelurahan_desa({
          kecamatan_kode: kecamatan.kode,
        });

      await dbClient
        .insert(dbSchema.ppwpKelurahanDesa)
        .values(
          response.data._flat_table.map((x) => {
            const provinsi_kode = x.kelurahan_desa.substring(0, 2);
            const provinsi_nama = listProvinsi.find(
              (y) => y.kode === provinsi_kode,
            )?.nama;
            const kabupaten_kota_kode = x.kelurahan_desa.substring(0, 4);
            const kabupaten_kota_nama = listKabupatenKota.find(
              (y) => y.kode === kabupaten_kota_kode,
            )?.nama;
            const kecamatan_kode = x.kelurahan_desa;
            const kecamatan_nama = listKecamatan.find(
              (y) => y.kode === kecamatan_kode,
            )?.nama;
            const kelurahan_desa_kode = x.kelurahan_desa;
            const kelurahan_desa_nama = listKelurahanDesa.find(
              (y) => y.kode === kelurahan_desa_kode,
            )?.nama;

            return {
              kode: x.kelurahan_desa,
              provinsi_kode,
              provinsi_nama,
              kabupaten_kota_kode,
              kabupaten_kota_nama,
              kecamatan_kode,
              kecamatan_nama,
              kelurahan_desa_kode,
              kelurahan_desa_nama,
              suara_paslon_1: nullGuard(x["100025"]),
              suara_paslon_2: nullGuard(x["100026"]),
              suara_paslon_3: nullGuard(x["100027"]),
              status_progress: x.status_progress,
              psu: response.data.psu,
              ts: response.data.ts,

              url_page: response.pageUrl,
              url_api: response.apiUrl,

              fetch_count: 1,
              persen: x.persen,
            };
          }),
        )
        .onConflictDoUpdate({
          target: [dbSchema.ppwpKelurahanDesa.kode],
          set: {
            provinsi_kode: sql`EXCLUDED.provinsi_kode`,
            provinsi_nama: sql`EXCLUDED.provinsi_nama`,
            kabupaten_kota_kode: sql`EXCLUDED.kabupaten_kota_kode`,
            kabupaten_kota_nama: sql`EXCLUDED.kabupaten_kota_nama`,
            kecamatan_kode: sql`EXCLUDED.kecamatan_kode`,
            kecamatan_nama: sql`EXCLUDED.kecamatan_nama`,
            suara_paslon_1: sql`EXCLUDED.suara_paslon_1`,
            suara_paslon_2: sql`EXCLUDED.suara_paslon_2`,
            suara_paslon_3: sql`EXCLUDED.suara_paslon_3`,
            persen: sql`EXCLUDED.persen`,
            status_progress: sql`EXCLUDED.status_progress`,
            psu: response.data.psu,
            ts: response.data.ts,

            url_page: response.pageUrl,
            url_api: response.apiUrl,
            updated_at: new Date(),
            fetch_count: sql`${dbSchema.ppwpKelurahanDesa.fetch_count} + 1`,
          },
        })
        .catch((e) => {
          console.log(e);
          logger.error(
            "Error on insert data: Hitung Suara - Presiden - Kelurahan/Desa",
            e,
          );
          throw e;
        });

      cli.increment();
    });
  }

  await concurrent.run();

  logger.info(
    "Successfully inserted data: Hitung Suara - Presiden - Kelurahan/Desa",
  );

  process.exit(0);
};

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

  const cli = initCli({
    total: count,
  });

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

      cli.increment();
    });
  }

  await concurrent.run();

  process.exit(0);
};

export const presidenActions = {
  insertTpsDetail,
  insertTpsDetailV2,
  updateTpsDetail,
  getSuaraProvinsi,
  getSuaraKabupatenKota,
  getSuaraKecamatan,
  getSuaraKelurahanDesa,
};
