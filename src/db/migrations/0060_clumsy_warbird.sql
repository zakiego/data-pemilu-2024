CREATE TABLE IF NOT EXISTS "pdpr_tps_list" (
	"id" integer PRIMARY KEY NOT NULL,
	"kode" text NOT NULL,
	"nama" text NOT NULL,
	"tingkat" integer NOT NULL,
	"fetch_count" integer DEFAULT 0,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "pdpr_tps_list_kode_unique" UNIQUE("kode")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pdpr_tps_list_tingkat_index" ON "pdpr_tps_list" ("tingkat");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pdpr_tps_list_fetch_count_index" ON "pdpr_tps_list" ("fetch_count");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "pdpr_tps_list_updated_at_index" ON "pdpr_tps_list" ("updated_at");