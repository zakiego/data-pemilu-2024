CREATE TABLE IF NOT EXISTS "pdpr_tps_caleg" (
	"_id" text PRIMARY KEY NOT NULL,
	"calon_id" text,
	"tps" text,
	"jumlah_suara" integer NOT NULL,
	"ts" text NOT NULL,
	"fetch_count" integer DEFAULT 0,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "pdpr_tps_chart_tps_calon_id_unique" UNIQUE("tps","calon_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pdpr_tps_caleg" ADD CONSTRAINT "pdpr_tps_caleg_calon_id_pdpr_calon_list_calon_id_fk" FOREIGN KEY ("calon_id") REFERENCES "pdpr_calon_list"("calon_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pdpr_tps_caleg" ADD CONSTRAINT "pdpr_tps_caleg_tps_pdpr_tps_list_kode_fk" FOREIGN KEY ("tps") REFERENCES "pdpr_tps_list"("kode") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
