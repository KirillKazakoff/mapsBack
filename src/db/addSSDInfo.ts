import { CtxT, ProductionOutputT, SSDT } from '../types';
import db from './db';
import {
    tCatch,
    spVessel,
    tSsd,
    tFuelReserve,
    tProductTransported,
    tProduct,
    spVbr,
    spProduct,
    spCompany,
    spSubzone,
} from './drizzle/schema';
import { groupTotal } from '../utils/groupify/groupTotal';
import { chunk } from 'lodash';
import { bot } from './bot';
import { dateDb } from '../utils/date';

export const addSSDInfo = async ({ request, response }: CtxT) => {
    bot.logDate('transfer SSD to DB');

    const sp = {
        vbr: await db.select().from(spVbr),
        prod: await db.select().from(spProduct),
        vessel: await db.select().from(spVessel),
        company: await db.select().from(spCompany),
        zone: await db.select().from(spSubzone),
    };

    // if no sp row occur from new added row then push error description id to array
    // const errorIdObj: { keyId: string; value: number }[] = [];
    const errorObj = {
        vessel: <number[]>[],
        company: <number[]>[],
        zone: <number[]>[],
        vbr: <number[]>[],
        product: <number[]>[],
    };

    // collect all ssd reports from all vessels into one array
    const ssdInputArray = (<SSDT[][]>request.body).reduce<SSDT[]>((total, ssdArr) => {
        total.push(...ssdArr);
        return total;
    }, []);

    const fnCheck = (checkErrorArray: any[]) => {
        checkErrorArray.forEach(([currentId, e, sourceId]) => {
            const errorArray = e as any[];
            if (currentId === 0 && sourceId && !errorArray.includes(+sourceId)) {
                errorArray.push(+sourceId);
            }
        });
    };

    const toDB = ssdInputArray.reduce<{
        info: (typeof tSsd.$inferInsert)[];
        input: (typeof tCatch.$inferInsert)[];
        output: (typeof tProduct.$inferInsert)[];
        outputBoard: (typeof tProductTransported.$inferInsert)[];
        fuelReserve: (typeof tFuelReserve.$inferInsert)[];
    }>(
        (total, ssdInput: SSDT) => {
            const { info, production } = ssdInput;

            // --- БЛОК 1: Основная информация ССД ---
            // check occurence in sp if no then set 0 in new db record
            // prettier-ignore
            const id = {
                vessel: sp.vessel.find((v) => v.idVessel === +info.vessel_id)?.idVessel || 0,
                company: sp.company.find((c) => c.idCompany === +info.company_id)?.idCompany || 0,
                zoneCurrent: sp.zone.find((z) => z.idSubzone === +info.status.placeId)?.idSubzone || 0,
                zoneArrival: info.status.destination.placeId ? sp.zone.find((z) => z.idSubzone === +info.status.destination.placeId)?.idSubzone || 0 : null,
            };

            const checkErrorArray = [
                [id.vessel, errorObj.vessel, info.vessel_id],
                [id.company, errorObj.company, info.company_id],
                [id.zoneCurrent, errorObj.zone, info.status.placeId],
                [id.zoneArrival, errorObj.zone, info.status.destination.placeId],
            ];
            fnCheck(checkErrorArray);

            const ssdInfoToDB: typeof tSsd.$inferInsert = {
                idVessel: id.vessel,
                idCompany: id.company,
                idSsd: info.id,
                dateSsd: info.date,
                idZoneCurrent: id.zoneCurrent,
                idZoneArrival: id.zoneArrival,
                coordinates: info.coordinates,
                dateArrival: info.status.destination.eta || null,
            };

            // --- БЛОК 2: PRODUCTION INPUT (Вылов) ---
            const inputToDB = production.input.map((i) => {
                // check occurence in sp if no then set 0 in new db record
                // prettier-ignore
                const id = {
                    vbr: sp.vbr.find((v) => v.idVbr === i.id)?.idVbr || 0,
                    subzone: sp.zone.find((z) => z.idSubzone === i.idSubzone)?.idSubzone || 0,
                    quote: sp.company.find((c) => c.idCompany === i.idQuote)?.idCompany || 0,
                }
                const checkErrorArray = [
                    [id.vbr, errorObj.vbr, i.id],
                    [id.subzone, errorObj.zone, i.idSubzone],
                    [id.quote, errorObj.company, i.idQuote],
                ];
                fnCheck(checkErrorArray);

                return {
                    idSsd: ssdInfoToDB.idSsd,
                    idVbr: id.vbr,
                    idSubzone: id.subzone,
                    idQuote: id.quote,
                    amount: i.total,
                } as typeof tCatch.$inferInsert;
            });

            const groupedInput = groupTotal({
                rows: inputToDB,
                input: (r) => ({ code: `${r.idVbr}` }),
            });

            groupedInput.forEach((group) => {
                group.rows.sort((a, b) => b.amount - a.amount);
            });

            // --- БЛОК 3: PRODUCTION OUTPUT (Выпуск продукции) ---
            const getIDOutput = (o: ProductionOutputT) => {
                const id = {
                    prod: sp.prod.find((p) => p.idProduct === o.idProduct)?.idProduct || 0,
                    vbr: sp.prod.find((p) => p.idProduct === o.idProduct)?.idVbr || 0,
                    subzone: sp.zone.find((z) => z.idSubzone === o.idSubzone)?.idSubzone || 0,
                    quote: sp.company.find((c) => c.idCompany === o.idQuote)?.idCompany || 0,
                };

                const checkErrorArray = [
                    [id.prod, errorObj.product, o.idProduct],
                    [id.subzone, errorObj.zone, o.idSubzone],
                    [id.quote, errorObj.company, o.idQuote],
                ];
                fnCheck(checkErrorArray);

                return id;
            };

            // Output current (за сутки)
            const prodOutputRecords = production.output.current.map((o) => {
                const id = getIDOutput(o);

                return {
                    idProduct: id.prod,
                    idSsd: ssdInfoToDB.idSsd,
                    idVbr: id.vbr,
                    amount: o.total,
                    idSubzone: id.subzone,
                    idQuote: id.quote,
                    coef: o.coefficient,
                } as typeof tProduct.$inferInsert & { coef: number };
            });

            //Output board (за год)
            const prodOutputBoardRecords = production.output.board.map((o) => {
                const id = getIDOutput(o);

                return {
                    idProduct: id.prod,
                    idSsd: ssdInfoToDB.idSsd,
                    idVbr: id.vbr,
                    amount: o.total,
                    coef: o.coefficient,
                };
            });

            // groupedOutputVbr - массив групп по ID продукции
            const groupedOutputVbr = groupTotal({
                rows: prodOutputRecords,
                input: (r) => ({
                    code: `${r.idProduct}`,
                }),
            });

            // MATCH ID SUBZONE QUOTES
            // outputToDB - массив формирующийся для отправки в БД
            let outputToDB: (typeof tProduct.$inferInsert & { coef: number })[] = [];

            if (!production.isLive) {
                outputToDB = groupedOutputVbr.reduce<typeof outputToDB>(
                    // groupOutput - это группа по ID продукции
                    (total, groupOutput) => {
                        groupOutput.rows.sort((a, b) => b.amount - a.amount);

                        console.log('non-live production');

                        groupOutput.rows.forEach((outputRecord, i) => {
                            // add counter on case different vbr
                            let counter = i;
                            const groupVbr = groupedInput.find(
                                (groupInput) => +groupInput.code === outputRecord.idVbr
                            );
                            if (!groupVbr) return;

                            if (groupVbr.rows.length === 1) counter = 0;

                            const inputR = groupVbr.rows[counter];
                            if (inputR) {
                                outputRecord.idQuote = inputR.idQuote;
                                outputRecord.idSubzone = inputR.idSubzone;
                            }
                        });

                        total.push(...groupOutput.rows);
                        return total;
                    },
                    []
                );
            }

            // if empty production output or live -> match input with product on board and transform to output
            const isEmptyProduction = groupedInput.length > 0 && outputToDB.length === 0;

            if (isEmptyProduction || production.isLive) {
                console.log('live or empty');

                outputToDB = inputToDB.map((input) => {
                    const o = prodOutputBoardRecords.find((o) => o.idVbr === input.idVbr);
                    if (!o) console.log('not found product id');

                    return {
                        idProduct: o?.idProduct || 0,
                        idSsd: input.idSsd,
                        idVbr: input.idVbr,
                        amount: input.amount,
                        idSubzone: input.idSubzone,
                        idQuote: input.idQuote,
                        coef: o?.coef,
                    } as typeof tProduct.$inferInsert & { coef: number };
                });
            }

            outputToDB.sort((a, b) => {
                if (a.amount > b.amount) {
                    return -1;
                }
                return 1;
            });

            inputToDB.sort((a, b) => {
                if (a.amount > b.amount) {
                    return -1;
                }
                return 1;
            });

            total.info.push(ssdInfoToDB);
            total.output.push(...outputToDB);
            total.input.push(...inputToDB);
            total.outputBoard.push(...prodOutputBoardRecords);
            // total.fuelReserve.push(reserve)

            return total;
        },
        { info: [], output: [], input: [], outputBoard: [], fuelReserve: [] }
    );

    // send to db data divided on chunks
    const chunkSize = 50;
    const toDbChunks = {
        info: chunk(toDB.info, chunkSize),
        input: chunk(toDB.input, chunkSize),
        output: chunk(toDB.output, chunkSize),
    };

    await db.transaction(async (tx) => {
        for (const batch of toDbChunks.info) {
            await tx.insert(tSsd).values(batch);
        }
    });
    await db.transaction(async (tx) => {
        for (const batch of toDbChunks.input) {
            await tx.insert(tCatch).values(batch);
        }
    });
    await db.transaction(async (tx) => {
        for (const batch of toDbChunks.output) {
            await tx.insert(tProduct).values(batch);
        }
    });

    console.log(dateDb.dateNow());
    bot.log(JSON.stringify(errorObj, null, 2));
    response.status = 200;
};

// export const insertVessel = async ({ request, response }: CtxT) => {
//     const vessel: typeof spVessel.$inferInsert = {
//         idCompany: 1381,
//         idVessel: 1111,
//         id: '1381-1111',
//         nameRus: 'ДЕБАГ',
//         nameEng: 'DEBUG',
//     };

//     try {
//         await db.insert(spVessel).values(vessel);
//     } catch (e: any) {
//         console.log(e.message);
//     }

//     response.status = 200;
// };

// export const deleteVessel = async ({ request, response }: CtxT) => {
//     await db.delete(spVessel).where(eq(spVessel.idVessel, 1111));
// };
