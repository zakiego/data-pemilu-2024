DO $$ BEGIN
 ALTER TABLE "pdpd_tps_chart" ADD CONSTRAINT "pdpd_tps_chart_calon_id_pdpd_calon_list_calon_id_fk" FOREIGN KEY ("calon_id") REFERENCES "pdpd_calon_list"("calon_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
