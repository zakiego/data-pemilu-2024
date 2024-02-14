ALTER TABLE "wilayah" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "wilayah" ADD COLUMN "created_at" timestamp DEFAULT now();