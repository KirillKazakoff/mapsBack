import { CtxT, ProductionOutputT, SSDT } from '../types';
import db from './db';
import {
    tCatch,
    spVessel,
    tSsd,
    tProductTransported,
    tProduct,
    spVbr,
    spProduct,
    spCompany,
    spSubzone,
} from '../drizzle/schema';
import { groupTotal } from '../utils/groupify/groupTotal';
import { chunk } from 'lodash';
import { bot } from './bot';
import { dateDb } from '../utils/date';
import { sql } from 'drizzle-orm';

export const addSSDInfo = async ({ request, response }: CtxT) => {
    const isDisableTriggers = request.query.disableTriggers === 'true';

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

    //debug
    const lastSsd = ssdInputArray[ssdInputArray.length - 1];
    console.log(lastSsd.production.input);

    const fnCheck = (checkErrorArray: any[]) => {
        checkErrorArray.forEach(([isFound, errorArray, sourceId]) => {
            if (!isFound && sourceId && !errorArray.includes(+sourceId)) {
                errorArray.push(+sourceId);
            }
        });
    };

    const toDB = ssdInputArray.reduce<{
        info: (typeof tSsd.$inferInsert)[];
        input: (typeof tCatch.$inferInsert)[];
        output: (typeof tProduct.$inferInsert)[];
        outputBoard: (typeof tProductTransported.$inferInsert)[];
    }>(
        (total, ssdInput: SSDT) => {
            const { info, production } = ssdInput;

            // --- БЛОК 1: Основная информация ССД ---
            // check occurence in sp if no then set 0 in new db record
            // prettier-ignore
            const id = {
                vessel: +info.vessel_id,
                company: +info.company_id,
                zoneCurrent: +info.status.placeId,
                zoneArrival: info.status.destination.placeId ? +info.status.destination.placeId : null,
            };
            // Ищем, есть ли id из ссд в справочниках (true / false)
            const isFound = {
                vessel: sp.vessel.some((v) => v.idVessel === id.vessel),
                company: sp.company.some((c) => c.idCompany === id.company),
                zoneCurrent: sp.zone.some((z) => z.idSubzone === id.zoneCurrent),
                zoneArrival: id.zoneArrival
                    ? sp.zone.some((z) => z.idSubzone === id.zoneArrival)
                    : true,
            };
            // Блок проверки
            const checkErrorArray = [
                [isFound.vessel, errorObj.vessel, info.vessel_id],
                [isFound.company, errorObj.company, info.company_id],
                [isFound.zoneCurrent, errorObj.zone, info.status.placeId],
                [isFound.zoneArrival, errorObj.zone, info.status.destination.placeId],
            ];
            fnCheck(checkErrorArray);

            const ssdInfoToDB: typeof tSsd.$inferInsert = {
                idSsd: info.id,
                idVessel: id.vessel,
                idCompany: id.company,
                idZoneCurrent: id.zoneCurrent,
                idZoneArrival: id.zoneArrival,
                coordinates: info.coordinates,
                dateArrival: info.status.destination.eta || null,
                dateSsd: info.date,
                status: info.status.main || 'НЕ ОПРЕДЕЛЕНО',
            };

            // --- БЛОК 2: PRODUCTION INPUT (Вылов) ---
            const inputToDB = production.input.map((i) => {
                // 1. Берем оригинальные ID из входных данных
                const id = {
                    vbr: +i.id,
                    subzone: +i.idSubzone,
                    quote: +i.idQuote,
                };

                // 2. Засовываем проверки в один объект isFound
                const isFound = {
                    vbr: sp.vbr.some((v) => v.idVbr === id.vbr),
                    subzone: sp.zone.some((z) => z.idSubzone === id.subzone),
                    quote: sp.company.some((c) => c.idCompany === id.quote),
                };

                // 3. Передаем флаги в fnCheck для сбора ошибок
                const checkErrorArray = [
                    [isFound.vbr, errorObj.vbr, i.id],
                    [isFound.subzone, errorObj.zone, i.idSubzone],
                    [isFound.quote, errorObj.company, i.idQuote],
                ];
                fnCheck(checkErrorArray);

                // 4. Возвращаем объект для вставки в БД
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
                // 1. Берем оригинальные ID из входных данных
                // Для vbr ищем оригинальный ID в справочнике sp.prod по idProduct
                const foundProd = sp.prod.find((p) => p.idProduct === +o.idProduct);

                const id = {
                    prod: +o.idProduct || 0,
                    vbr: foundProd && foundProd.idVbr ? Number(foundProd.idVbr) : 0,
                    subzone: +o.idSubzone || 0,
                    quote: +o.idQuote || 0,
                };

                // 2. Засовываем проверки наличия в один объект isFound
                const isFound = {
                    prod: sp.prod.some((p) => p.idProduct === id.prod),
                    subzone: sp.zone.some((z) => z.idSubzone === id.subzone),
                    quote: sp.company.some((c) => c.idCompany === id.quote),
                };

                // 3. Передаем флаги в fnCheck для сбора ошибок справочников
                const checkErrorArray = [
                    [isFound.prod, errorObj.product, o.idProduct],
                    [isFound.subzone, errorObj.zone, o.idSubzone],
                    [isFound.quote, errorObj.company, o.idQuote],
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
                    amount: +o.total || 0,
                    idSubzone: id.subzone,
                    idQuote: id.quote,
                } as typeof tProduct.$inferInsert & { coef: number };
            });

            //Output board (суммарно на борту)
            const prodOutputBoardRecords = production.output.board.map((o) => {
                const id = getIDOutput(o);

                return {
                    idProduct: id.prod,
                    idSsd: ssdInfoToDB.idSsd,
                    idVbr: id.vbr,
                    amount: +o.total || 0,
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
            let outputToDB: (typeof tProduct.$inferInsert)[] = [];

            if (!production.isLive) {
                outputToDB = groupedOutputVbr.reduce<typeof outputToDB>(
                    // groupOutput - это группа по ID продукции
                    (total, groupOutput) => {
                        groupOutput.rows.sort((a, b) => b.amount - a.amount);

                        // console.log('non-live production');

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
                // console.log('live or empty');

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

            return total;
        },
        { info: [], output: [], input: [], outputBoard: [] }
    );

    // send to db data divided on chunks
    const chunkSize = 50;
    const toDbChunks = {
        info: chunk(toDB.info, chunkSize),
        input: chunk(toDB.input, chunkSize),
        output: chunk(toDB.output, chunkSize),
        outputBoard: chunk(toDB.outputBoard, chunkSize),
    };

    await db.transaction(async (tx) => {
        // 1. Если передан флаг, отключаем триггеры в самом начале
        if (isDisableTriggers) {
            console.log('🛑 Временно отключаем триггеры для ускорения...');
            await tx.execute(sql`ALTER TABLE t_ssd DISABLE TRIGGER ALL;`);
        }

        // 2. Вставляем ССД (Главная таблица)
        for (const batch of toDbChunks.info) {
            await tx.insert(tSsd).values(batch);
        }

        // 3. Уловы (Дочерняя таблица)
        for (const batch of toDbChunks.input) {
            await tx.insert(tCatch).values(batch);
        }

        // 4. Продукты (Дочерняя таблица)
        for (const batch of toDbChunks.output) {
            await tx.insert(tProduct).values(batch);
        }

        // 4. Продукты Транспорт (Дочерняя таблица)
        for (const batch of toDbChunks.outputBoard) {
            await tx.insert(tProductTransported).values(batch);
        }

        // 5. Включаем триггеры обратно перед коммитом
        if (isDisableTriggers) {
            await tx.execute(sql`ALTER TABLE t_ssd ENABLE TRIGGER ALL;`);
            console.log('🟢 Триггеры успешно включены обратно.');
        }
    });

    console.log(dateDb.dateNow());
    bot.log(JSON.stringify(errorObj, null, 2));
    response.status = 200;
};
