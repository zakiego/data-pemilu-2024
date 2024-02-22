CREATE TABLE IF NOT EXISTS "ppwp_provinsi" (
	"kode" text PRIMARY KEY NOT NULL,
	"provinsi_kode" text NOT NULL,
	"provinsi_nama" text,
	"suara_paslon_1" integer,
	"suara_paslon_2" integer,
	"suara_paslon_3" integer,
	"persen" text,
	"status_progress" boolean,
	"psu" text,
	"ts" text,
	"_updated_at" timestamp DEFAULT now(),
	"_created_at" timestamp DEFAULT now(),
	"_fetch_count" integer DEFAULT 0
);
