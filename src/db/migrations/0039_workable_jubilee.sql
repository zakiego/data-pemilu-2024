CREATE TABLE IF NOT EXISTS "pdpd_tps_chart" (
	"_id" text PRIMARY KEY NOT NULL,
	"calon_id" text,
	"tps" text,
	"jumlah_suara" integer NOT NULL,
	"ts" text NOT NULL,
	"fetch_count" integer DEFAULT 0,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "pdpd_tps_chart_tps_calon_id_unique" UNIQUE("tps","calon_id")
);
