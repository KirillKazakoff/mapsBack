import { CtxT } from '../types';
import db from './db';
import { spVessel } from './drizzle/schema';

export const getVessels = async ({ request, response }: CtxT) => {
    response.body = await db.select().from(spVessel);
    response.status = 200;
};
