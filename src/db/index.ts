import { wilayah } from "@/db/schema";
import { env } from "@/utils/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const dbSchema = {
	wilayah,
};

export const migrationClient = drizzle(postgres(env.DATABASE_URL, { max: 1 }));

const queryClient = postgres(env.DATABASE_URL, { max: 3 });
export const dbClient = drizzle(queryClient, {
	schema: dbSchema,
});
