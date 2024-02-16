ALTER TABLE "wilayah" RENAME COLUMN "is_fetched" TO "is_fetched_presiden";--> statement-breakpoint
ALTER TABLE "wilayah" ADD COLUMN "is_fetched_dpr" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "wilayah" ADD COLUMN "is_fetched_dpd" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "wilayah" ADD COLUMN "is_fetched_dprd_provinsi" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "wilayah" ADD COLUMN "is_fetched_dprd_kabupaten_kota" boolean DEFAULT false;