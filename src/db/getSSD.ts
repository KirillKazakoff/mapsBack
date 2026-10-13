import { CtxT } from '../types';
import { bot } from './bot';
import db from './db';
import { spVessel, tSsd } from '../drizzle/schema';
import { and, eq, getColumns, sql } from 'drizzle-orm';

export const fetchLastSSD = async (vesselIds: number[]) => {
    if (!vesselIds || vesselIds.length === 0) return [];

    // База данных выполнит ОДИН запрос и сама найдет последние записи для всех судов
    const rows = await db
        .selectDistinctOn([tSsd.idVessel], {
            ...getColumns(tSsd),
            vessel: getColumns(spVessel),
        })
        .from(tSsd)
        // Выполняем LEFT JOIN по составному ключу (двум полям)
        .leftJoin(
            spVessel,
            and(eq(tSsd.idVessel, spVessel.idVessel), eq(tSsd.idCompany, spVessel.idCompany))
        )
        // Критически важно для DISTINCT ON в Postgres: сначала колонка дистинкта, затем дата DESC
        .orderBy(tSsd.idVessel, sql`${tSsd.dateSsd} DESC`);

    return rows;
};

export const getLastSSD = async ({ request, response }: CtxT) => {
    const vessels = await db.select().from(spVessel);

    const vesselIds = vessels.map((v) => v.idVessel);
    const ssdList = await fetchLastSSD(vesselIds);

    response.body = ssdList;
};

export const fetchFullSSD = async (id: string) => {
    const res = await db.query.tSsd.findFirst({
        where: { idSsd: id },
        with: {
            company: true,
            catches: {
                with: {
                    vbr: true,
                    subzone: true,
                },
            },
            products: {
                with: {
                    product: true,
                    subzone: true,
                },
            },
            productsTransported: {
                with: {
                    product: true,
                },
            },
            vessel: true,
            zoneArrival: true,
            zoneCurrent: true,
        },
    });

    return res;
};

export const getSSDById = async ({ request, response, params }: CtxT) => {
    const { id } = params;
    const row = await fetchFullSSD(id);

    response.body = row;
    response.status = 200;
};
