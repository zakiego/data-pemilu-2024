ALTER TABLE "wilayah" RENAME COLUMN "is_fetched_presiden" TO "_is_fetched_presiden";--> statement-breakpoint
ALTER TABLE "wilayah" RENAME COLUMN "is_fetched_dpr" TO "_is_fetched_dpr";--> statement-breakpoint
ALTER TABLE "wilayah" RENAME COLUMN "is_fetched_dpd" TO "_is_fetched_dpd";--> statement-breakpoint
ALTER TABLE "wilayah" RENAME COLUMN "is_fetched_dprd_provinsi" TO "_is_fetched_dprd_provinsi";--> statement-breakpoint
ALTER TABLE "wilayah" RENAME COLUMN "is_fetched_dprd_kabupaten_kota" TO "_is_fetched_dprd_kabupaten_kota";--> statement-breakpoint
DROP INDEX IF EXISTS "is_fetched_presiden_index";--> statement-breakpoint
DROP INDEX IF EXISTS "is_fetched_dpr_index";--> statement-breakpoint
DROP INDEX IF EXISTS "is_fetched_dpd_index";--> statement-breakpoint
DROP INDEX IF EXISTS "is_fetched_dprd_provinsi_index";--> statement-breakpoint
DROP INDEX IF EXISTS "is_fetched_dprd_kabupaten_kota_index";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "is_fetched_presiden_index" ON "wilayah" ("_is_fetched_presiden");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "is_fetched_dpr_index" ON "wilayah" ("_is_fetched_dpr");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "is_fetched_dpd_index" ON "wilayah" ("_is_fetched_dpd");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "is_fetched_dprd_provinsi_index" ON "wilayah" ("_is_fetched_dprd_provinsi");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "is_fetched_dprd_kabupaten_kota_index" ON "wilayah" ("_is_fetched_dprd_kabupaten_kota");