CREATE TABLE IF NOT EXISTS "pdpr_tps_partai" (
	"_id" text PRIMARY KEY NOT NULL,
	"tps" text,
	"partai_id" text,
	"jumlah_suara_total" integer NOT NULL,
	"jumlah_suara_partai" integer NOT NULL,
	"ts" text NOT NULL,
	"fetch_count" integer DEFAULT 0,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "pdpr_tps_partai_tps_partai_id_unique" UNIQUE("tps","partai_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pdpr_tps_partai" ADD CONSTRAINT "pdpr_tps_partai_tps_pdpr_tps_list_kode_fk" FOREIGN KEY ("tps") REFERENCES "pdpr_tps_list"("kode") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
