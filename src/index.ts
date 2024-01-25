import { z } from "zod";
import { dbClient, dbSchema } from "~/db";
import { logger } from "~/utils/log";

const main = async () => {
  const data = await fetch("https://jsonplaceholder.typicode.com/posts/").then(
    (res) => res.json(),
  );

  logger.info("Fetched data");

  const schmea = z.array(
    z.object({
      userId: z.number(),
      id: z.number(),
      title: z.string(),
      body: z.string(),
    }),
  );

  const parsedData = schmea.parse(data);

  await dbClient.insert(dbSchema.data).values({
    data: parsedData,
  });

  logger.info("Inserted data");
};
