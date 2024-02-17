import { dbClient, dbSchema } from "@/db";
import { ENDPOINT_FUNCTION } from "@/endpoint";
import { logger } from "@/utils/log";

const PARTAI_SHCEMA = dbSchema.partai;

const inserPartaiList = async () => {
  const response = await ENDPOINT_FUNCTION.partai.getPartaiList();
  logger.info(`Successfully fetched data for Dapil: ${response.length} rows`);

  // key object to array
  const responseArray = Object.keys(response).map((key) => response[key]);

  console.log(responseArray);

  const insert = await dbClient
    .insert(PARTAI_SHCEMA)
    .values(responseArray)
    .onConflictDoNothing()
    .returning();

  logger.info(`Successfully inserted data for Dapil: ${insert.length} rows`);

  process.exit(0);
};

export const partaiAction = {
  inserPartaiList,
};
