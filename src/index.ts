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

  const insert = await dbClient
    .insert(dbSchema.data)
    .values(
      parsedData.map((d) => {
        return { id: d.id.toString(), data: d };
      }),
    )
    .onConflictDoNothing()
    .returning();

  logger.info(`Inserted ${insert.length} rows`);

  const result = await dbClient.select().from(dbSchema.data).limit(3);

  console.log(result);
};

main();
