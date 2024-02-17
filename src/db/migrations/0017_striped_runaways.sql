CREATE TABLE IF NOT EXISTS "pdpr_dapil_list" (
	"id" integer PRIMARY KEY NOT NULL,
	"nama" text NOT NULL,
	"kode" text NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
