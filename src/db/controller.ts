import { CtxT } from '../types';
import { SSD } from '../models/models';
import db from './db';
import { queries } from './queriesDb/queries';
import pgFormat from 'pg-format';

export const addSsd = async ({ request, response }: CtxT) => {
    const ssd = <SSD>request.body;

    const query = `INSERT INTO ssd(id, date, vessel_id, company, agreement_no, zone, coordinates) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

    const newSsd = await db.query(query, [
        ssd.id,
        ssd.date,
        ssd.vessel_id,
        ssd.company_id,
        ssd.agreement_no,
        ssd.zone_id,
        ssd.coordinates,
    ]);

    response.body = newSsd.rows[0];
    console.log(ssd);
};

export const getSsd = async ({ response }: CtxT) => {
    const query = queries.get.ssd;
    const ssd = await db.query(query);

    response.body = ssd.rows;
};

export const getSsdById = async ({ params, response }: CtxT) => {
    const id = params.id;

    const query = `${queries.get.ssd} WHERE ssd.id = $1;`;
    const res = await db.query(query, [id]);

    response.body = res.rows[0];
};

export const getVessels = async ({ response }: CtxT) => {
    const query = `SELECT * FROM vessel`;
    const ssd = await db.query(query);

    response.body = ssd.rows;
};

export const getVesselById = async ({ params, response }: CtxT) => {
    const id = params.id;

    const query = `SELECT * FROM vessel WHERE id = $1`;
    const res = await db.query(query, [id]);

    response.body = res.rows[0];
};

export const updateZones = async ({ request, response }: CtxT) => {
    const zones = request.body;
    const query = pgFormat(queries.post.catch_zones, zones);

    db.query(query);
    response.status = 200;
};
