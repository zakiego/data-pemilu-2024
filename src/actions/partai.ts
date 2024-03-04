import { dbClient, dbSchema } from "@/db";
import { ENDPOINT_FUNCTION } from "@/endpoint";
import { logger } from "@/utils/log";
import { sql } from "drizzle-orm";

const PARTAI_SHCEMA = dbSchema.partai;

const inserPartaiList = async () => {
  const response = await ENDPOINT_FUNCTION.partai.getPartaiList();

  // key object to array
  const responseArray = Object.keys(response).map((key) => response[key]);

  logger.info(
    `Successfully fetched data for Dapil: ${responseArray.length} rows`,
  );

  const insert = await dbClient
    .insert(PARTAI_SHCEMA)
    .values(responseArray)
    .onConflictDoUpdate({
      target: [dbSchema.partai.id_partai],
      set: {
        ts: sql`excluded.ts`,
        id_pilihan: sql`excluded.id_pilihan`,
        is_aceh: sql`excluded.is_aceh`,
        nama: sql`excluded.nama`,
        nama_lengkap: sql`excluded.nama_lengkap`,
        nomor_urut: sql`excluded.nomor_urut`,
        warna: sql`excluded.warna`,
      },
    })
    .returning();

  logger.info(`Successfully inserted data for Dapil: ${insert.length} rows`);

  process.exit(0);
};

export const partaiAction = {
  inserPartaiList,
};
