CREATE TABLE IF NOT EXISTS "pdpd_tps_administrasi" (
	"tps" text PRIMARY KEY NOT NULL,
	"images" text[],
	"suara_sah" integer,
	"suara_total" integer,
	"pemilih_dpt_j" integer,
	"pemilih_dpt_l" integer,
	"pemilih_dpt_p" integer,
	"pengguna_dpt_j" integer,
	"pengguna_dpt_l" integer,
	"pengguna_dpt_p" integer,
	"pengguna_dptb_j" integer,
	"pengguna_dptb_l" integer,
	"pengguna_dptb_p" integer,
	"suara_tidak_sah" integer,
	"pengguna_total_j" integer,
	"pengguna_total_l" integer,
	"pengguna_total_p" integer,
	"pengguna_non_dpt_j" integer,
	"pengguna_non_dpt_l" integer,
	"pengguna_non_dpt_p" integer,
	"ts" text NOT NULL,
	"psu" text,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "pdpd_tps_chart" (
	"calon_id" text PRIMARY KEY NOT NULL,
	"tps" text,
	"jumlah_suara" integer NOT NULL,
	"ts" text NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pdpd_tps_chart" ADD CONSTRAINT "pdpd_tps_chart_calon_id_pdpd_calon_list_calon_id_fk" FOREIGN KEY ("calon_id") REFERENCES "pdpd_calon_list"("calon_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "pdpd_tps_chart" ADD CONSTRAINT "pdpd_tps_chart_tps_pdpd_tps_administrasi_tps_fk" FOREIGN KEY ("tps") REFERENCES "pdpd_tps_administrasi"("tps") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
