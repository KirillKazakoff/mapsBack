import { CtxT } from '../types';
import { SSD } from '../models/models';
import db from './db';
import { queries } from './queriesDb/queries';
import pgFormat from 'pg-format';
import { dateDb } from '../utils/date';

export const addSsdList = async ({ request, response }: CtxT) => {
    const ssdList = <SSD[]>request.body;

    const promises = ssdList.map(async (ssd) => {
        ssd.date = dateDb.toDb(ssd.date);
        await db.query(queries.post.ssd(ssd));
    });
    await Promise.all(promises);

    console.log('made it');
    response.status = 200;
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
