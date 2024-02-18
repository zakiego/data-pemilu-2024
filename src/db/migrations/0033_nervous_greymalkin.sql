DROP INDEX IF EXISTS "fetch_count_index";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pdpd_tps_list_fetch_count_index" ON "pdpd_tps_list" ("fetch_count");