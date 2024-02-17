CREATE TABLE IF NOT EXISTS "partai" (
	"id_partai" integer PRIMARY KEY NOT NULL,
	"id_pilihan" integer NOT NULL,
	"is_aceh" boolean NOT NULL,
	"nama" text NOT NULL,
	"nama_lengkap" text NOT NULL,
	"nomor_urut" integer NOT NULL,
	"warna" text NOT NULL,
	"ts" text NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "id_pilihan_index" ON "partai" ("id_pilihan");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "is_aceh_index" ON "partai" ("is_aceh");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nomor_urut_index" ON "partai" ("nomor_urut");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nama_index" ON "partai" ("nama");