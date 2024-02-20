import { dbSchema } from "@/db/schema";
import { env } from "@/utils/env";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const migrationClient = drizzle(postgres(env.DATABASE_URL, { max: 1 }));

// const queryClient = postgres(env.DATABASE_URL, { max: 25 });
// export const dbClient = drizzle(queryClient, {
//   schema: dbSchema,
// });

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
        onnotice(notice) {
          console.log(`Notice: ${notice}`);
        },
        onclose(connId) {
          console.log(`Connection ${connId} closed`);
        },
        max: 25,
        idle_timeout: 1000,
        connect_timeout: 1000,
      }),
      { schema: dbSchema },
    );

  db = global.db;
}

export const dbClient = db;
