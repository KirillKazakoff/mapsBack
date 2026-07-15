import {
    pgTable,
    foreignKey,
    text,
    integer,
    real,
    serial,
    varchar,
    primaryKey,
    pgSequence,
    unique,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const tProductIdSeq = pgSequence('T_Product_id_seq', {
    startWith: '1',
    increment: '1',
    minValue: '1',
    maxValue: '9223372036854775807',
    cache: '1',
    cycle: false,
});

export const tSsd = pgTable(
    't_ssd',
    {
        idSsd: text('id_ssd').primaryKey().notNull(),
        idVessel: integer('id_vessel').notNull(),
        idCompany: integer('id_company').notNull(), // Добавили поле
        idZoneCurrent: integer('id_zone_current').notNull(),
        idZoneArrival: integer('id_zone_arrival'),
        coordinates: text('coordinates'),
        dateArrival: text('date_arrival'),
        dateSsd: text('date_ssd').notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.idZoneArrival],
            foreignColumns: [spSubzone.idSubzone],
            name: 'SSD_ID_zone_arrival_fkey',
        }),
        foreignKey({
            columns: [table.idZoneCurrent],
            foreignColumns: [spSubzone.idSubzone],
            name: 'SSD_ID_zone_current_fkey',
        }),
        // Добавляем наш составной внешний ключ
        // foreignKey({
        //     columns: [table.idCompany, table.idVessel],
        //     foreignColumns: [spVessel.idCompany, spVessel.idVessel],
        //     name: 'T_SSD_composite_vessel_fk',
        // }),
    ]
);

export const tCatch = pgTable(
    't_catch',
    {
        idSsd: text('id_ssd').notNull(),
        idSubzone: integer('id_subzone').notNull(),
        idVbr: integer('id_vbr').notNull(),
        amount: real().notNull(),
        id: serial().primaryKey().notNull(),
        idQuote: integer('id_quote'),
    },
    (table) => [
        foreignKey({
            columns: [table.idQuote],
            foreignColumns: [spCompany.idCompany],
            name: 't_catch_sp_company_fk',
        }),
        foreignKey({
            columns: [table.idSubzone],
            foreignColumns: [spSubzone.idSubzone],
            name: 't_catch_sp_subzone_fk',
        }),
        foreignKey({
            columns: [table.idVbr],
            foreignColumns: [spVbr.idVbr],
            name: 't_catch_sp_vbr_fk',
        }),
        foreignKey({
            columns: [table.idSsd],
            foreignColumns: [tSsd.idSsd],
            name: 'ID_ssd',
        }).onDelete('cascade'),
    ]
);

export const spSubzone = pgTable(
    'sp_subzone',
    {
        idSubzone: integer('id_subzone').primaryKey().notNull(),
        subareaRus: text('subarea_rus').notNull(),
        areaRus: text('area_rus').notNull(),
        subareaEng: text('subarea_eng'),
        status: varchar(),
        idZone: integer('id_zone'),
        country: varchar(),
    },
    (table) => [
        foreignKey({
            columns: [table.idZone],
            foreignColumns: [spZone.idZone],
            name: 'sp_subzone_sp_zone_fk',
        }),
    ]
);

export const spVbr = pgTable('sp_vbr', {
    idVbr: integer('id_vbr').primaryKey().notNull(),
    nameRus: text('name_rus'),
    nameEng: text('name_eng'),
    group: text(),
});

export const spZone = pgTable('sp_zone', {
    idZone: integer('id_zone').primaryKey().notNull(),
    nameRus: text('name_rus').notNull(),
    nameEng: text('name_eng'),
});

export const spCompany = pgTable('sp_company', {
    idCompany: integer('id_company').primaryKey().notNull(),
    nameRus: text('name_rus').notNull(),
    nameEng: text('name_eng').notNull(),
    group: text(),
});

export const spVessel = pgTable(
    'sp_vessel',
    {
        idVessel: integer('id_vessel').notNull(),
        nameRus: text('name_rus').notNull(),
        nameEng: text('name_eng'),
        idCompany: integer('id_company').notNull(),
        id: varchar('id').primaryKey().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.idCompany],
            foreignColumns: [spCompany.idCompany],
            name: 'sp_vessel_sp_company_fk',
        }),
        // // Добавляем уникальность составного ключа
        // unique('sp_vessel_composite_uq').on(table.idCompany, table.idVessel),
    ]
);

export const tProduct = pgTable(
    't_product',
    {
        id: integer()
            .default(sql`nextval('"T_Product_id_seq"'::regclass)`)
            .primaryKey()
            .notNull(),
        idSsd: text('id_ssd').notNull(),
        idSubzone: integer('id_subzone').notNull(),
        idVbr: integer('id_vbr').notNull(),
        amount: real().notNull(),
        idQuote: integer('id_quote'),
        idProduct: integer('id_product').notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.idSubzone],
            foreignColumns: [spSubzone.idSubzone],
            name: 'Product_ID_subzone_fkey',
        }),
        foreignKey({
            columns: [table.idVbr],
            foreignColumns: [spVbr.idVbr],
            name: 'Product_ID_vbr_fkey',
        }),
        foreignKey({
            columns: [table.idQuote],
            foreignColumns: [spCompany.idCompany],
            name: 't_product_sp_company_fk',
        }),
        foreignKey({
            columns: [table.idSsd],
            foreignColumns: [tSsd.idSsd],
            name: 't_product_t_ssd_fk',
        }).onDelete('cascade'),
    ]
);

export const tProductTransported = pgTable(
    't_product_transported',
    {
        id: serial().primaryKey().notNull(),
        idSsd: text('id_ssd').notNull(),
        idProduct: integer('id_product').notNull(),
        amount: real().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.idProduct],
            foreignColumns: [spProduct.idProduct],
            name: 'ProductTransported_ID_product_fkey',
        }),
        foreignKey({
            columns: [table.idSsd],
            foreignColumns: [tSsd.idSsd],
            name: 'ProductTransported_ID_ssd_fkey',
        }),
    ]
);

export const spProduct = pgTable(
    'sp_product',
    {
        idProduct: integer('id_product').primaryKey().notNull(),
        nameRus: text('name_rus').notNull(),
        nameEng: text('name_eng').notNull(),
        group: varchar(),
        sortRus: varchar('sort_rus'),
        sortEng: varchar('sort_eng'),
        idVbr: integer('ID_vbr'),
    },
    (table) => [
        foreignKey({
            columns: [table.idVbr],
            foreignColumns: [spVbr.idVbr],
            name: 'sp_product_sp_vbr_fk',
        }),
    ]
);

export const tFuelReserve = pgTable(
    't_fuel_reserve',
    {
        id: serial().notNull(),
        idSsd: text('Id_ssd').notNull(),
        amount: real().notNull(),
        amountTotal: real('amount_total').notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.idSsd],
            foreignColumns: [tSsd.idSsd],
            name: 'FuelReserve_ID_ssd_fkey',
        }),
        primaryKey({ columns: [table.id, table.idSsd], name: 'FuelReserve_pkey' }),
    ]
);
