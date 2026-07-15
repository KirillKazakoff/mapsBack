import { relations } from "drizzle-orm/relations";
import { spSubzone, tSsd, spCompany, tCatch, spVbr, spZone, spVessel, tProduct, spProduct, tProductTransported, tFuelReserve } from "./schema";

export const tSsdRelations = relations(tSsd, ({one, many}) => ({
	spSubzone_idZoneArrival: one(spSubzone, {
		fields: [tSsd.idZoneArrival],
		references: [spSubzone.idSubzone],
		relationName: "tSsd_idZoneArrival_spSubzone_idSubzone"
	}),
	spSubzone_idZoneCurrent: one(spSubzone, {
		fields: [tSsd.idZoneCurrent],
		references: [spSubzone.idSubzone],
		relationName: "tSsd_idZoneCurrent_spSubzone_idSubzone"
	}),
	tCatches: many(tCatch),
	tProducts: many(tProduct),
	tProductTransporteds: many(tProductTransported),
	tFuelReserves: many(tFuelReserve),
}));

export const spSubzoneRelations = relations(spSubzone, ({one, many}) => ({
	tSsds_idZoneArrival: many(tSsd, {
		relationName: "tSsd_idZoneArrival_spSubzone_idSubzone"
	}),
	tSsds_idZoneCurrent: many(tSsd, {
		relationName: "tSsd_idZoneCurrent_spSubzone_idSubzone"
	}),
	tCatches: many(tCatch),
	spZone: one(spZone, {
		fields: [spSubzone.idZone],
		references: [spZone.idZone]
	}),
	tProducts: many(tProduct),
}));

export const tCatchRelations = relations(tCatch, ({one}) => ({
	spCompany: one(spCompany, {
		fields: [tCatch.idQuote],
		references: [spCompany.idCompany]
	}),
	spSubzone: one(spSubzone, {
		fields: [tCatch.idSubzone],
		references: [spSubzone.idSubzone]
	}),
	spVbr: one(spVbr, {
		fields: [tCatch.idVbr],
		references: [spVbr.idVbr]
	}),
	tSsd: one(tSsd, {
		fields: [tCatch.idSsd],
		references: [tSsd.idSsd]
	}),
}));

export const spCompanyRelations = relations(spCompany, ({many}) => ({
	tCatches: many(tCatch),
	spVessels: many(spVessel),
	tProducts: many(tProduct),
}));

export const spVbrRelations = relations(spVbr, ({many}) => ({
	tCatches: many(tCatch),
	tProducts: many(tProduct),
	spProducts: many(spProduct),
}));

export const spZoneRelations = relations(spZone, ({many}) => ({
	spSubzones: many(spSubzone),
}));

export const spVesselRelations = relations(spVessel, ({one}) => ({
	spCompany: one(spCompany, {
		fields: [spVessel.idCompany],
		references: [spCompany.idCompany]
	}),
}));

export const tProductRelations = relations(tProduct, ({one}) => ({
	spSubzone: one(spSubzone, {
		fields: [tProduct.idSubzone],
		references: [spSubzone.idSubzone]
	}),
	spVbr: one(spVbr, {
		fields: [tProduct.idVbr],
		references: [spVbr.idVbr]
	}),
	spCompany: one(spCompany, {
		fields: [tProduct.idQuote],
		references: [spCompany.idCompany]
	}),
	tSsd: one(tSsd, {
		fields: [tProduct.idSsd],
		references: [tSsd.idSsd]
	}),
}));

export const tProductTransportedRelations = relations(tProductTransported, ({one}) => ({
	spProduct: one(spProduct, {
		fields: [tProductTransported.idProduct],
		references: [spProduct.idProduct]
	}),
	tSsd: one(tSsd, {
		fields: [tProductTransported.idSsd],
		references: [tSsd.idSsd]
	}),
}));

export const spProductRelations = relations(spProduct, ({one, many}) => ({
	tProductTransporteds: many(tProductTransported),
	spVbr: one(spVbr, {
		fields: [spProduct.idVbr],
		references: [spVbr.idVbr]
	}),
}));

export const tFuelReserveRelations = relations(tFuelReserve, ({one}) => ({
	tSsd: one(tSsd, {
		fields: [tFuelReserve.idSsd],
		references: [tSsd.idSsd]
	}),
}));