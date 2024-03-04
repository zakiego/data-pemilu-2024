ALTER TABLE "pdpr_tps_caleg" DROP CONSTRAINT "pdpr_tps_caleg_calon_id_pdpr_calon_list_calon_id_fk";
--> statement-breakpoint
ALTER TABLE "pdpr_tps_caleg" ALTER COLUMN "calon_id" SET NOT NULL;