CREATE TABLE IF NOT EXISTS "pdpr_dapil_calon_list" (
	"nama" text NOT NULL,
	"jenis_kelamin" text NOT NULL,
	"tempat_tinggal" text NOT NULL,
	"calon_id" text PRIMARY KEY NOT NULL,
	"partai_id" text NOT NULL,
	"nomor_urut_calon_di_partai" integer NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
