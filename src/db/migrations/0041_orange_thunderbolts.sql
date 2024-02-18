DO $$ BEGIN
 ALTER TABLE "pdpd_tps_chart" ADD CONSTRAINT "pdpd_tps_chart_tps_pdpd_tps_list_kode_fk" FOREIGN KEY ("tps") REFERENCES "pdpd_tps_list"("kode") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
