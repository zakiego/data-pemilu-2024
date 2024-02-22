CREATE TABLE IF NOT EXISTS "ppwp_nasional" (
	"id" text PRIMARY KEY NOT NULL,
	"suara_paslon_1" integer,
	"suara_paslon_2" integer,
	"suara_paslon_3" integer,
	"psu" text,
	"ts" text,
	"_updated_at" timestamp DEFAULT now(),
	"_created_at" timestamp DEFAULT now(),
	"_fetch_count" integer DEFAULT 0
);
