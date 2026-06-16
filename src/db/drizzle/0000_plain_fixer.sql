-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "T_ProductTransported" (
	"ID" serial PRIMARY KEY NOT NULL,
	"ID_ssd" text NOT NULL,
	"ID_product" integer NOT NULL,
	"amount" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "T_SSD" (
	"ID_ssd" text PRIMARY KEY NOT NULL,
	"ID_vessel" integer NOT NULL,
	"ID_zone_current" integer NOT NULL,
	"ID_zone_arrival" integer,
	"coordinates" text,
	"date_arrival" text,
	"date_ssd" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "T_Catch" (
	"ID_ssd" text NOT NULL,
	"ID_subzone" integer NOT NULL,
	"ID_vbr" integer NOT NULL,
	"amount" real NOT NULL,
	"ID" serial PRIMARY KEY NOT NULL,
	"id_quote" integer
);
--> statement-breakpoint
CREATE TABLE "T_Product" (
	"ID_product" integer NOT NULL,
	"ID_ssd" text NOT NULL,
	"ID_subzone" integer NOT NULL,
	"ID_vbr" integer NOT NULL,
	"amount" real NOT NULL,
	"id_quote" integer,
	"id" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SP_Company" (
	"ID_company" integer PRIMARY KEY NOT NULL,
	"name_rus" text NOT NULL,
	"name_eng" text NOT NULL,
	"group" text
);
--> statement-breakpoint
CREATE TABLE "SP_Vbr" (
	"ID_vbr" integer PRIMARY KEY NOT NULL,
	"name_rus" text,
	"name_eng" text,
	"group" text
);
--> statement-breakpoint
CREATE TABLE "SP_Subzone" (
	"ID_subzone" integer PRIMARY KEY NOT NULL,
	"subarea_rus" text NOT NULL,
	"area_rus" text NOT NULL,
	"subarea_eng" text,
	"status" varchar,
	"id_zone" integer,
	"country" varchar
);
--> statement-breakpoint
CREATE TABLE "SP_Product" (
	"ID_product" integer PRIMARY KEY NOT NULL,
	"name_rus" text NOT NULL,
	"name_eng" text NOT NULL,
	"group" varchar,
	"sort_rus" varchar,
	"sort_eng" varchar,
	"ID_vbr" integer
);
--> statement-breakpoint
CREATE TABLE "SP_Zone" (
	"id_zone" integer PRIMARY KEY NOT NULL,
	"name_rus" text NOT NULL,
	"name_eng" text
);
--> statement-breakpoint
CREATE TABLE "SP_Vessel" (
	"id_vessel" integer NOT NULL,
	"name_rus" text NOT NULL,
	"name_eng" text,
	"id_company" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "T_FuelReserve" (
	"ID" serial NOT NULL,
	"ID_ssd" text NOT NULL,
	"amount" real NOT NULL,
	"amount_total" real NOT NULL,
	CONSTRAINT "FuelReserve_pkey" PRIMARY KEY("ID_ssd","ID")
);
--> statement-breakpoint
ALTER TABLE "T_ProductTransported" ADD CONSTRAINT "ProductTransported_ID_ssd_fkey" FOREIGN KEY ("ID_ssd") REFERENCES "public"."T_SSD"("ID_ssd") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "T_ProductTransported" ADD CONSTRAINT "ProductTransported_ID_product_fkey" FOREIGN KEY ("ID_product") REFERENCES "public"."SP_Product"("ID_product") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "T_SSD" ADD CONSTRAINT "SSD_ID_zone_current_fkey" FOREIGN KEY ("ID_zone_current") REFERENCES "public"."SP_Subzone"("ID_subzone") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "T_SSD" ADD CONSTRAINT "SSD_ID_zone_arrival_fkey" FOREIGN KEY ("ID_zone_arrival") REFERENCES "public"."SP_Subzone"("ID_subzone") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "T_Catch" ADD CONSTRAINT "t_catch_sp_company_fk" FOREIGN KEY ("id_quote") REFERENCES "public"."SP_Company"("ID_company") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "T_Catch" ADD CONSTRAINT "t_catch_sp_subzone_fk" FOREIGN KEY ("ID_subzone") REFERENCES "public"."SP_Subzone"("ID_subzone") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "T_Catch" ADD CONSTRAINT "t_catch_sp_vbr_fk" FOREIGN KEY ("ID_vbr") REFERENCES "public"."SP_Vbr"("ID_vbr") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "T_Catch" ADD CONSTRAINT "ID_ssd" FOREIGN KEY ("ID_ssd") REFERENCES "public"."T_SSD"("ID_ssd") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "T_Product" ADD CONSTRAINT "Product_ID_subzone_fkey" FOREIGN KEY ("ID_subzone") REFERENCES "public"."SP_Subzone"("ID_subzone") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "T_Product" ADD CONSTRAINT "Product_ID_vbr_fkey" FOREIGN KEY ("ID_vbr") REFERENCES "public"."SP_Vbr"("ID_vbr") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "T_Product" ADD CONSTRAINT "t_product_t_ssd_fk" FOREIGN KEY ("ID_ssd") REFERENCES "public"."T_SSD"("ID_ssd") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "T_Product" ADD CONSTRAINT "t_product_sp_company_fk" FOREIGN KEY ("id_quote") REFERENCES "public"."SP_Company"("ID_company") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SP_Subzone" ADD CONSTRAINT "sp_subzone_sp_zone_fk" FOREIGN KEY ("id_zone") REFERENCES "public"."SP_Zone"("id_zone") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SP_Product" ADD CONSTRAINT "sp_product_sp_vbr_fk" FOREIGN KEY ("ID_vbr") REFERENCES "public"."SP_Vbr"("ID_vbr") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "SP_Vessel" ADD CONSTRAINT "sp_vessel_sp_company_fk" FOREIGN KEY ("id_company") REFERENCES "public"."SP_Company"("ID_company") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "T_FuelReserve" ADD CONSTRAINT "FuelReserve_ID_ssd_fkey" FOREIGN KEY ("ID_ssd") REFERENCES "public"."T_SSD"("ID_ssd") ON DELETE no action ON UPDATE no action;
*/