import { dbSchema } from "@/db/schema";
import { env } from "@/utils/env";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { drizzle as drizzleNodePostgres } from "drizzle-orm/node-postgres";

export const migrationClient = drizzle(postgres(env.DATABASE_URL, { max: 1 }));

export { dbSchema };

// declare global {
//   // biome-ignore lint/style/noVar: <explanation>
//   var db: PostgresJsDatabase<typeof dbSchema> | undefined;
// }

// // biome-ignore lint/suspicious/noRedeclare: <explanation>
// let db: PostgresJsDatabase<typeof dbSchema>;

// if (env.NODE_ENV === "production") {
//   db = drizzle(
//     postgres(env.DATABASE_URL, {
//       max: 50,
//     }),
//     { schema: dbSchema },
//   );
// } else {
//   if (!global.db)
//     global.db = drizzle(
//       postgres(env.DATABASE_URL, {
//         max: 70,
//       }),
//       { schema: dbSchema },
//     );

//   db = global.db;
// }

// export const dbClient = db;

import { Client, Pool } from "pg";
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  // log(...messages) {
  //   console.log("DATABASE LOG:", ...messages);
  // },
  maxUses: 70,
  connectionTimeoutMillis: 20_000, // 20 seconds
  idleTimeoutMillis: 30_000, // 30 seconds
  allowExitOnIdle: true,
});

export const dbClient = drizzleNodePostgres(pool, {
  schema: dbSchema,
});
