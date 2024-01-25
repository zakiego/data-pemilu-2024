import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema",
  out: "./src/db/migrations",
  driver: "better-sqlite", // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
  dbCredentials: {
    url: "sqlite.db",
  },
} satisfies Config;
