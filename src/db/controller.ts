import { CtxT } from '../types';
import { SSD } from '../models/models';
import db from './db';

export const addSsd = async ({ request, response }: CtxT) => {
    const ssd = <SSD>request.body;

    const query = `INSERT INTO ssd(id, date, vessel_id, company, agreement_no, zone, coordinates) values ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;

    const newSsd = await db.query(query, [
        ssd.id,
        ssd.date,
        ssd.vessel_id,
        ssd.company,
        ssd.agreement_no,
        ssd.zone,
        ssd.coordinates,
    ]);

    response.body = newSsd.rows[0];
    console.log(ssd);
};

export const getSsd = async ({ response }: CtxT) => {
    const query = `SELECT * FROM ssd`;
    const ssd = await db.query(query);

    response.body = ssd.rows;
};

export const getSsdById = async ({ params, response }: CtxT) => {
    const id = params.id;
    console.log(id);

    const query = `SELECT * FROM ssd WHERE id = $1;`;
    const res = await db.query(query, [id]);

    response.body = res.rows[0];
};
