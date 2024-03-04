CREATE TABLE IF NOT EXISTS "pdpr_calon_list" (
	"nama" text NOT NULL,
	"nomor_urut" integer NOT NULL,
	"jenis_kelamin" text NOT NULL,
	"tempat_tinggal" text NOT NULL,
	"dapil_kode" text NOT NULL,
	"calon_id" text PRIMARY KEY NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
