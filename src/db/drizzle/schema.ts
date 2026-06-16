import { pgTable, foreignKey, serial, text, integer, real, varchar, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const tProductTransported = pgTable("T_ProductTransported", {
	id: serial("ID").primaryKey().notNull(),
	idSsd: text("ID_ssd").notNull(),
	idProduct: integer("ID_product").notNull(),
	amount: real().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.idSsd],
			foreignColumns: [tSsd.idSsd],
			name: "ProductTransported_ID_ssd_fkey"
		}),
	foreignKey({
			columns: [table.idProduct],
			foreignColumns: [spProduct.idProduct],
			name: "ProductTransported_ID_product_fkey"
		}),
]);

export const tSsd = pgTable("T_SSD", {
	idSsd: text("ID_ssd").primaryKey().notNull(),
	idVessel: integer("ID_vessel").notNull(),
	idZoneCurrent: integer("ID_zone_current").notNull(),
	idZoneArrival: integer("ID_zone_arrival"),
	coordinates: text(),
	dateArrival: text("date_arrival"),
	dateSsd: text("date_ssd").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.idZoneCurrent],
			foreignColumns: [spSubzone.idSubzone],
			name: "SSD_ID_zone_current_fkey"
		}),
	foreignKey({
			columns: [table.idZoneArrival],
			foreignColumns: [spSubzone.idSubzone],
			name: "SSD_ID_zone_arrival_fkey"
		}),
]);

export const tCatch = pgTable("T_Catch", {
	idSsd: text("ID_ssd").notNull(),
	idSubzone: integer("ID_subzone").notNull(),
	idVbr: integer("ID_vbr").notNull(),
	amount: real().notNull(),
	id: serial("ID").primaryKey().notNull(),
	idQuote: integer("id_quote"),
}, (table) => [
	foreignKey({
			columns: [table.idQuote],
			foreignColumns: [spCompany.idCompany],
			name: "t_catch_sp_company_fk"
		}),
	foreignKey({
			columns: [table.idSubzone],
			foreignColumns: [spSubzone.idSubzone],
			name: "t_catch_sp_subzone_fk"
		}),
	foreignKey({
			columns: [table.idVbr],
			foreignColumns: [spVbr.idVbr],
			name: "t_catch_sp_vbr_fk"
		}),
	foreignKey({
			columns: [table.idSsd],
			foreignColumns: [tSsd.idSsd],
			name: "ID_ssd"
		}).onDelete("cascade"),
]);

export const tProduct = pgTable("T_Product", {
	idProduct: integer("ID_product").notNull(),
	idSsd: text("ID_ssd").notNull(),
	idSubzone: integer("ID_subzone").notNull(),
	idVbr: integer("ID_vbr").notNull(),
	amount: real().notNull(),
	idQuote: integer("id_quote"),
	id: serial().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.idSubzone],
			foreignColumns: [spSubzone.idSubzone],
			name: "Product_ID_subzone_fkey"
		}),
	foreignKey({
			columns: [table.idVbr],
			foreignColumns: [spVbr.idVbr],
			name: "Product_ID_vbr_fkey"
		}),
	foreignKey({
			columns: [table.idSsd],
			foreignColumns: [tSsd.idSsd],
			name: "t_product_t_ssd_fk"
		}),
	foreignKey({
			columns: [table.idQuote],
			foreignColumns: [spCompany.idCompany],
			name: "t_product_sp_company_fk"
		}),
]);

export const spCompany = pgTable("SP_Company", {
	idCompany: integer("ID_company").primaryKey().notNull(),
	nameRus: text("name_rus").notNull(),
	nameEng: text("name_eng").notNull(),
	group: text(),
});

export const spVbr = pgTable("SP_Vbr", {
	idVbr: integer("ID_vbr").primaryKey().notNull(),
	nameRus: text("name_rus"),
	nameEng: text("name_eng"),
	group: text(),
});

export const spSubzone = pgTable("SP_Subzone", {
	idSubzone: integer("ID_subzone").primaryKey().notNull(),
	subareaRus: text("subarea_rus").notNull(),
	areaRus: text("area_rus").notNull(),
	subareaEng: text("subarea_eng"),
	status: varchar(),
	idZone: integer("id_zone"),
	country: varchar(),
}, (table) => [
	foreignKey({
			columns: [table.idZone],
			foreignColumns: [spZone.idZone],
			name: "sp_subzone_sp_zone_fk"
		}),
]);

export const spProduct = pgTable("SP_Product", {
	idProduct: integer("ID_product").primaryKey().notNull(),
	nameRus: text("name_rus").notNull(),
	nameEng: text("name_eng").notNull(),
	group: varchar(),
	sortRus: varchar("sort_rus"),
	sortEng: varchar("sort_eng"),
	idVbr: integer("ID_vbr"),
}, (table) => [
	foreignKey({
			columns: [table.idVbr],
			foreignColumns: [spVbr.idVbr],
			name: "sp_product_sp_vbr_fk"
		}),
]);

export const spZone = pgTable("SP_Zone", {
	idZone: integer("id_zone").primaryKey().notNull(),
	nameRus: text("name_rus").notNull(),
	nameEng: text("name_eng"),
});

export const spVessel = pgTable("SP_Vessel", {
	idVessel: integer("id_vessel").notNull(),
	nameRus: text("name_rus").notNull(),
	nameEng: text("name_eng"),
	idCompany: integer("id_company").notNull(),
	id: varchar().primaryKey().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.idCompany],
			foreignColumns: [spCompany.idCompany],
			name: "sp_vessel_sp_company_fk"
		}),
]);

export const tFuelReserve = pgTable("T_FuelReserve", {
	id: serial("ID").notNull(),
	idSsd: text("ID_ssd").notNull(),
	amount: real().notNull(),
	amountTotal: real("amount_total").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.idSsd],
			foreignColumns: [tSsd.idSsd],
			name: "FuelReserve_ID_ssd_fkey"
		}),
	primaryKey({ columns: [table.idSsd, table.id], name: "FuelReserve_pkey"}),
]);
