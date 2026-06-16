import { CtxT, SSDT } from '../types';
import db from './db';
import { tCatch, spVessel, tSsd, tProduct, spVbr, spProduct } from './drizzle/schema';
import { DrizzleQueryError, eq } from 'drizzle-orm';
import { groupTotal } from '../utils/groupify/groupTotal';
import { chunk } from 'lodash';

export const addSSDInfo = async ({ request, response }: CtxT) => {
    console.log('start ssd add');
    const fromSpProd = await db.select().from(spProduct);

    // collect all ssd reports from all vessels into one array
    const ssdInputArray = (<SSDT[][]>request.body).reduce<SSDT[]>((total, ssdArr) => {
        total.push(...ssdArr);
        return total;
    }, []);

    const toDB = ssdInputArray.reduce<{
        info: (typeof tSsd.$inferInsert)[];
        input: (typeof tCatch.$inferInsert)[];
        output: (typeof tProduct.$inferInsert)[];
    }>(
        (total, ssdInput: SSDT) => {
            const { info, production } = ssdInput;

            const ssdInfoToDB: typeof tSsd.$inferInsert = {
                idVessel: +info.vessel_id,
                idSsd: info.id,
                dateSsd: info.date,
                idZoneCurrent: info.status.placeId,
                idZoneArrival: info.status.destination.placeId,
                coordinates: info.coordinates,
                dateArrival: info.status.destination.eta,
            };

            // PRODUCTION INPUT
            const inputToDB = production.input.map((i) => {
                return {
                    idSsd: ssdInfoToDB.idSsd,
                    idVbr: i.id,
                    idSubzone: i.idSubzone,
                    idQuote: i.idQuote,
                    amount: i.total,
                } as typeof tCatch.$inferInsert;
            });

            const groupedInput = groupTotal({
                rows: inputToDB,
                input: (r) => ({ code: `${r.idVbr}` }),
            });

            groupedInput.forEach((group) => {
                group.rows.sort((a, b) => {
                    if (a.amount < b.amount) return 1;
                    return -1;
                });
            });

            // PRODUCTION OUTPUT MATCH ID SUBZONE QUOTES

            // Output current
            const prodOutputRecords = production.output.current.map((o) => {
                //need to add check on no find index
                const idVbr = fromSpProd.find(
                    (spRecord) => spRecord.idProduct === o.idProduct
                )?.idVbr;

                return {
                    idProduct: o.idProduct,
                    idSsd: ssdInfoToDB.idSsd,
                    idVbr: idVbr,
                    amount: o.total,
                    idSubzone: 0,
                    idQuote: 0,
                    coef: o.coefficient,
                } as typeof tProduct.$inferInsert & { coef: number };
            });

            //Output board
            const prodOutputBoardRecords = production.output.board.map((o) => {
                const idVbr = fromSpProd.find(
                    (spRecord) => spRecord.idProduct === o.idProduct
                )?.idVbr;

                return {
                    idProduct: o.idProduct,
                    idSsd: ssdInfoToDB.idSsd,
                    idVbr: idVbr,
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

            // outputToDB - массив формирующийся для отправки в БД
            let outputToDB: (typeof tProduct.$inferInsert & { coef: number })[] = [];

            if (!production.isLive) {
                outputToDB = groupedOutputVbr.reduce<typeof outputToDB>(
                    // groupOutput - это группа по ID продукции
                    (total, groupOutput) => {
                        groupOutput.rows.sort((a, b) => {
                            if (a.amount < b.amount) return 1;
                            return -1;
                        });

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

                            try {
                                outputRecord.idQuote = inputR.idQuote;
                                outputRecord.idSubzone = inputR.idSubzone;
                            } catch (e) {
                                console.log('ERROR occur on fetch input row properties');
                                console.log('ssd info:');
                                console.log(ssdInput.info);
                                console.log('input');
                                console.log(ssdInput.production.input);
                                console.log('output');
                                console.log(ssdInput.production.output.current);

                                console.log('\n\n groups: \n\n');
                                console.log('group input');
                                console.log(groupVbr);
                                // console.log(groupedInput[0].rows);
                                console.log('group output');
                                console.log(groupOutput);
                                // console.log(groupedOutputVbr);

                                throw new Error('STOP');
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
                        idProduct: o?.idProduct,
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

            // console.log(ssdInputArray[0].production.input);
            // console.log(ssdInputArray[0].production.output.current);
            // console.log(inputToDB);
            // console.log(outputToDB);

            total.info.push(ssdInfoToDB);
            total.output.push(...outputToDB);
            total.input.push(...inputToDB);

            return total;
        },
        { info: [], output: [], input: [] }
    );

    // send to db
    const chunkSize = 1;
    const toDbChunks = {
        info: chunk(toDB.info, chunkSize),
        input: chunk(toDB.input, chunkSize),
        output: chunk(toDB.output, chunkSize),
    };

    // await db.transaction(async (tx) => {
    //     await tx.insert(tSsd).values(toDbChunks.info[0]);
    // });

    // try {
    await db.transaction(async (tx) => {
        for (const batch of toDbChunks.info) {
            await tx.insert(tSsd).values(batch);
        }
    });
    // } catch (error: unknown) {
    //     if (error instanceof DrizzleQueryError) {
    //         console.error('❌ Запрос Drizzle завершился ошибкой!');
    //         console.error('SQL-текст запроса:', error.message); // Покажет сам SQL

    //         // Настоящая ошибка СУБД (PostgreSQL / MySQL / SQLite) лежит здесь:
    //         const dbError = error.cause as any;

    //         if (dbError) {
    //             console.error('👉 Конкретная причина ошибки:', dbError.message);
    //             console.error('Код ошибки СУБД (SQLState):', dbError.code); // Например, '23505'
    //             console.error('Детали СУБД:', dbError.detail); // Например, 'Key (ID_ssd)=(...) already exists'
    //         }
    //     } else {
    //         // Системные ошибки Node.js (например, Stack Overflow или обрыв сети)
    //         console.error('Нетипичная ошибка:', error);
    //     }
    // }
    // try {
    //     // await db.transaction(async (tx) => {
    //     //     for (const batch of toDbChunks.info) {
    //     //         await tx.insert(tSsd).values(batch);
    //     //     }
    //     // });
    // } catch (error: any) {
    //     console.log('=== ПОДРОБНАЯ ИНФОРМАЦИЯ ОБ ОШИБКЕ ===');

    //     // Показывает абсолютно все скрытые свойства объекта ошибки
    //     console.dir(error, { depth: null });

    //     // Если ошибка пришла из драйвера БД (pg/postgres), у неё будут эти скрытые поля:
    //     if (error.detail) console.error('Детали СУБД:', error.detail); // Например: "Key (id)=(1) already exists"
    //     if (error.code) console.error('Код ошибки PostgreSQL:', error.code); // Например: "23505"
    //     if (error.hint) console.error('Подсказка базы:', error.hint);
    // }

    // await db.transaction(async (tx) => {
    //     for (const batch of toDbChunks.input) {
    //         await tx.insert(tCatch).values(batch);
    //     }
    // });
    // await db.transaction(async (tx) => {
    //     for (const batch of toDbChunks.output) {
    //         await tx.insert(tProduct).values(batch);
    //     }
    // });

    // await db.insert(tSsd).values(toDB.info);
    // await db.insert(tCatch).values(toDB.input);
    // await db.insert(tProduct).values(toDB.output);

    response.status = 200;
};

export const insertVessel = async ({ request, response }: CtxT) => {
    const vessel: typeof spVessel.$inferInsert = {
        idCompany: 1381,
        idVessel: 1111,
        id: '1381-1111',
        nameRus: 'ДЕБАГ',
        nameEng: 'DEBUG',
    };

    try {
        await db.insert(spVessel).values(vessel);
    } catch (e: any) {
        console.log(e.message);
    }

    response.status = 200;
};

export const deleteVessel = async ({ request, response }: CtxT) => {
    await db.delete(spVessel).where(eq(spVessel.idVessel, 1111));
};
