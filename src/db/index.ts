import { dbSchema } from "@/db/schema";
import { env } from "@/utils/env";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { drizzle as drizzleNodePostgres } from "drizzle-orm/node-postgres";

export const migrationClient = drizzle(postgres(env.DATABASE_URL, { max: 1 }));

export { dbSchema };

declare global {
  // biome-ignore lint/style/noVar: <explanation>
  var db: PostgresJsDatabase<typeof dbSchema> | undefined;
}

// biome-ignore lint/suspicious/noRedeclare: <explanation>
let db: PostgresJsDatabase<typeof dbSchema>;

if (env.NODE_ENV === "production") {
  db = drizzle(postgres(env.DATABASE_URL), { schema: dbSchema });
} else {
  if (!global.db)
    global.db = drizzle(
      postgres(env.DATABASE_URL, {
        max: 70,
      }),
      { schema: dbSchema },
    );

  db = global.db;
}

export const dbClient = db;

// import { Client, Pool } from "pg";
// const pool = new Pool({
//   connectionString: env.DATABASE_URL,
//   log(...messages) {
//     console.log("DATABASE LOG:", ...messages);
//   },
// });

// export const dbClient = drizzleNodePostgres(pool, {
//   schema: dbSchema,
// });
