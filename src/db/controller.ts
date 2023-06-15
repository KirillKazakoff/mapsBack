import { CtxT } from '../types';
import { SSD } from '../models/models';
import db from './db';
import { queries } from './queriesDb/queries';
import pgFormat from 'pg-format';
import { dateDb } from '../utils/date';

const addSsd = async (ssdCurrent: SSD) => {
    const res = await db.query(queries.get.lastSsdByVessel(ssdCurrent.vessel_id));
    const ssdLast: SSD = res.rows[0];
    console.log(res.rows);

    if (ssdLast) {
        const dateLast = dateDb.fromDb(ssdLast.date);
        if (dateLast === ssdCurrent.date) return;
    }

    ssdCurrent.date = dateDb.toDb(ssdCurrent.date);

    await db.query(queries.post.ssd, [
        ssdCurrent.id,
        ssdCurrent.date,
        ssdCurrent.company_id,
        ssdCurrent.agreement_no,
        ssdCurrent.catch_zone_id,
        ssdCurrent.coordinates,
        ssdCurrent.vessel_id,
    ]);
};

export const addSsdList = async ({ request, response }: CtxT) => {
    const ssdList = <SSD[]>request.body;

    const promises = ssdList.map(async (ssd) => {
        await addSsd(ssd);
    });
    await Promise.all(promises);

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
