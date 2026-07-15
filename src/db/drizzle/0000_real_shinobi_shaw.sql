-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE SEQUENCE "public"."T_Product_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1;--> statement-breakpoint
CREATE TABLE "t_ssd" (
	"id_ssd" text PRIMARY KEY NOT NULL,
	"id_vessel" integer NOT NULL,
	"id_zone_current" integer NOT NULL,
	"id_zone_arrival" integer,
	"coordinates" text,
	"date_arrival" text,
	"date_ssd" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "t_catch" (
	"id_ssd" text NOT NULL,
	"id_subzone" integer NOT NULL,
	"id_vbr" integer NOT NULL,
	"amount" real NOT NULL,
	"id" serial PRIMARY KEY NOT NULL,
	"id_quote" integer
);
--> statement-breakpoint
CREATE TABLE "sp_subzone" (
	"id_subzone" integer PRIMARY KEY NOT NULL,
	"subarea_rus" text NOT NULL,
	"area_rus" text NOT NULL,
	"subarea_eng" text,
	"status" varchar,
	"id_zone" integer,
	"country" varchar
);
--> statement-breakpoint
CREATE TABLE "sp_vbr" (
	"id_vbr" integer PRIMARY KEY NOT NULL,
	"name_rus" text,
	"name_eng" text,
	"group" text
);
--> statement-breakpoint
CREATE TABLE "sp_zone" (
	"id_zone" integer PRIMARY KEY NOT NULL,
	"name_rus" text NOT NULL,
	"name_eng" text
);
--> statement-breakpoint
CREATE TABLE "sp_company" (
	"id_company" integer PRIMARY KEY NOT NULL,
	"name_rus" text NOT NULL,
	"name_eng" text NOT NULL,
	"group" text
);
--> statement-breakpoint
CREATE TABLE "sp_vessel" (
	"id_vessel" integer NOT NULL,
	"name_rus" text NOT NULL,
	"name_eng" text,
	"id_company" integer NOT NULL,
	"id" varchar PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "t_product" (
	"id" integer PRIMARY KEY DEFAULT nextval('"T_Product_id_seq"'::regclass) NOT NULL,
	"id_ssd" text NOT NULL,
	"id_subzone" integer NOT NULL,
	"id_vbr" integer NOT NULL,
	"amount" real NOT NULL,
	"id_quote" integer,
	"id_product" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "t_product_transported" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_ssd" text NOT NULL,
	"id_product" integer NOT NULL,
	"amount" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sp_product" (
	"id_product" integer PRIMARY KEY NOT NULL,
	"name_rus" text NOT NULL,
	"name_eng" text NOT NULL,
	"group" varchar,
	"sort_rus" varchar,
	"sort_eng" varchar,
	"ID_vbr" integer
);
--> statement-breakpoint
CREATE TABLE "t_fuel_reserve" (
	"id" serial NOT NULL,
	"Id_ssd" text NOT NULL,
	"amount" real NOT NULL,
	"amount_total" real NOT NULL,
	CONSTRAINT "FuelReserve_pkey" PRIMARY KEY("id","Id_ssd")
);
--> statement-breakpoint
ALTER TABLE "t_ssd" ADD CONSTRAINT "SSD_ID_zone_arrival_fkey" FOREIGN KEY ("id_zone_arrival") REFERENCES "public"."sp_subzone"("id_subzone") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "t_ssd" ADD CONSTRAINT "SSD_ID_zone_current_fkey" FOREIGN KEY ("id_zone_current") REFERENCES "public"."sp_subzone"("id_subzone") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "t_catch" ADD CONSTRAINT "t_catch_sp_company_fk" FOREIGN KEY ("id_quote") REFERENCES "public"."sp_company"("id_company") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "t_catch" ADD CONSTRAINT "t_catch_sp_subzone_fk" FOREIGN KEY ("id_subzone") REFERENCES "public"."sp_subzone"("id_subzone") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "t_catch" ADD CONSTRAINT "t_catch_sp_vbr_fk" FOREIGN KEY ("id_vbr") REFERENCES "public"."sp_vbr"("id_vbr") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "t_catch" ADD CONSTRAINT "ID_ssd" FOREIGN KEY ("id_ssd") REFERENCES "public"."t_ssd"("id_ssd") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sp_subzone" ADD CONSTRAINT "sp_subzone_sp_zone_fk" FOREIGN KEY ("id_zone") REFERENCES "public"."sp_zone"("id_zone") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sp_vessel" ADD CONSTRAINT "sp_vessel_sp_company_fk" FOREIGN KEY ("id_company") REFERENCES "public"."sp_company"("id_company") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "t_product" ADD CONSTRAINT "Product_ID_subzone_fkey" FOREIGN KEY ("id_subzone") REFERENCES "public"."sp_subzone"("id_subzone") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "t_product" ADD CONSTRAINT "Product_ID_vbr_fkey" FOREIGN KEY ("id_vbr") REFERENCES "public"."sp_vbr"("id_vbr") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "t_product" ADD CONSTRAINT "t_product_sp_company_fk" FOREIGN KEY ("id_quote") REFERENCES "public"."sp_company"("id_company") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "t_product" ADD CONSTRAINT "t_product_t_ssd_fk" FOREIGN KEY ("id_ssd") REFERENCES "public"."t_ssd"("id_ssd") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "t_product_transported" ADD CONSTRAINT "ProductTransported_ID_product_fkey" FOREIGN KEY ("id_product") REFERENCES "public"."sp_product"("id_product") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "t_product_transported" ADD CONSTRAINT "ProductTransported_ID_ssd_fkey" FOREIGN KEY ("id_ssd") REFERENCES "public"."t_ssd"("id_ssd") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sp_product" ADD CONSTRAINT "sp_product_sp_vbr_fk" FOREIGN KEY ("ID_vbr") REFERENCES "public"."sp_vbr"("id_vbr") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "t_fuel_reserve" ADD CONSTRAINT "FuelReserve_ID_ssd_fkey" FOREIGN KEY ("Id_ssd") REFERENCES "public"."t_ssd"("id_ssd") ON DELETE no action ON UPDATE no action;
*/