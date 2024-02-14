import type { Config } from "drizzle-kit";
import { env } from "@/utils/env";

export default {
	schema: "./src/db/schema",
	out: "./src/db/migrations",
	driver: "pg",
	dbCredentials: {
		connectionString: env.DATABASE_URL,
	},
} satisfies Config;
