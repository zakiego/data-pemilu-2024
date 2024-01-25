import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";
import { data } from "./schema";

export const dbConnection = new Database("sqlite.db");

const dbSchema = {
  data,
};

const dbClient = drizzle(dbConnection, {
  schema: dbSchema,
});

export { dbSchema, dbClient };
