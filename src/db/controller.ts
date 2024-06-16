import { CtxT, SSDInfoSoleT } from '../types';
import {
    Bait,
    Coordinates,
    ProductionDetails,
    ProductionInput,
    ProductionTransport,
    Reserve,
    SSD,
    SSDInfoT,
} from '../models/models';
import db from './db';
import { queries } from './queriesDb/queries';
import pgFormat from 'pg-format';
import { dateDb } from '../utils/date';

export const addSSDInfo = async ({ request, response }: CtxT) => {
    console.log('receiving data from osm service');
    const ssdInfo = <SSDInfoT>request.body;

    console.log(
        ssdInfo.ssd
            .map((ssd) => ssd.id)
            .sort((a, b) => {
                if (a > b) return 1;
                return -1;
            })
    );

    const ssdPromises = ssdInfo.ssd.map(async (ssd) => {
        ssd.date = dateDb.toDb(ssd.date, 'dd.MM.yyyy');
        await db.query(queries.post.ssd(ssd));
    });
    await Promise.all(ssdPromises);

    const detailsPromises = ssdInfo.productionDetails.map(async (details) => {
        await db.query(queries.post.production_details(details));
    });
    const inputPromises = ssdInfo.productionInput.map(async (input) => {
        await db.query(queries.post.production_input(input));
    });
    const transportPromises = ssdInfo.productionTransport.map(async (transport) => {
        await db.query(queries.post.production_transport(transport));
    });
    const reservePromises = ssdInfo.reserve.map(async (reserve) => {
        await db.query(queries.post.reserve(reserve));
    });
    const baitPromises = ssdInfo.bait.map(async (bait) => {
        await db.query(queries.post.bait(bait));
    });

    await Promise.all([
        ...detailsPromises,
        ...inputPromises,
        ...reservePromises,
        ...baitPromises,
        ...transportPromises,
    ]);

    console.log('success');
    response.status = 200;
};

export const updateCoordinates = async ({ request, response }: CtxT) => {
    const coordinatesArr = <Coordinates[]>request.body;
    const coordinatePromises = coordinatesArr.map(async (coordinates) => {
        coordinates.date = dateDb.toDb(coordinates.date, 'dd.MM.yyyy mm:ss');
        console.log(coordinates);
        // console.log(coordinates.date);

        await db.query(queries.post.coordinates(coordinates));
    });
    await Promise.all(coordinatePromises);

    console.log('updated coordinates');
    response.status = 200;
};

export const getSSDInfoByVesselId = async ({ params, response }: CtxT) => {
    const ssdList = (await db.query<SSD>(queries.get.ssdByVessel(params.id))).rows;

    const ssdInfoListPromises = ssdList.map((ssd) => {
        return new Promise(async (resolve) => {
            if (!ssd) {
                resolve(null);
                return null;
            }

            const productionDetails = (
                await db.query<ProductionDetails>(queries.get.productionDetails(ssd.id))
            ).rows;
            const productionInput = (
                await db.query<ProductionInput>(queries.get.productionInput(ssd.id))
            ).rows[0];
            const reserve = (await db.query<Reserve>(queries.get.reserve(ssd.id)))
                .rows[0];
            const bait = (await db.query<Bait>(queries.get.bait(ssd.id))).rows;
            const productionTransport = (
                await db.query<ProductionTransport>(
                    queries.get.productionTransport(ssd.id)
                )
            ).rows;

            const ssdInfo: SSDInfoSoleT = {
                ssd,
                productionDetails,
                productionInput,
                reserve,
                bait,
                productionTransport,
            };
            resolve(ssdInfo);
            return ssdInfo;
        });
    });

    const ssdInfoList = await Promise.all(ssdInfoListPromises);
    response.body = ssdInfoList;
};

export const getVessels = async ({ params, response }: CtxT) => {
    const vessels = await db.query(queries.get.vessels(params.companyId));
    response.body = vessels.rows;
};

export const getVesselById = async ({ params, response }: CtxT) => {
    const res = await db.query(queries.get.vessel(params.id));
    response.body = res.rows[0];
};

// dictionary requests
export const updateZones = async ({ request, response }: CtxT) => {
    const zones = request.body;
    const query = pgFormat(queries.post.catch_zones, zones);

    db.query(query);
    response.status = 200;
};
