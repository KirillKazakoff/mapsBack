import { Context, Next } from 'koa';
import { DrizzleQueryError } from 'drizzle-orm/errors';

export async function drizzleErrorMiddleware(ctx: Context, next: Next) {
    try {
        // Передаем управление следующим middleware и роутам
        await next();
    } catch (error: any) {
        // Проверяем, является ли ошибка внутренней ошибкой Drizzle ORM
        if (error instanceof DrizzleQueryError || error.name === 'DrizzleQueryError') {
            const dbError = error.cause as any; // Скрытая runtime-ошибка драйвера (pg, neon и др.)

            // Красивый и подробный вывод в консоль разработчика (терминал сервера)
            console.error('\n\x1b[41m\x1b[37m [KOA DB ERROR INTERCEPTOR] \x1b[0m');
            console.error(`\x1b[31mСообщение:\x1b[0m    ${error.message}`);

            if (dbError) {
                console.error(
                    `\x1b[33mКод СУБД:\x1b[0m     ${dbError.code || 'Не указан'}`
                );
                console.error(
                    `\x1b[35mДетали СУБД:\x1b[0m  ${dbError.detail || 'Нет деталей'}`
                );
                if (dbError.hint) {
                    console.error(`\x1b[36mПодсказка:\x1b[0m    ${dbError.hint}`);
                }
            }
            console.error('\x1b[41m\x1b[37m ---------------------------- \x1b[0m\n');

            // Формируем понятный и безопасный ответ для клиента (фронтенда / Postman)
            ctx.status = 400; // Bad Request (так как ошибка обычно в данных запроса)
            ctx.body = {
                success: false,
                error: 'Database operation failed',
                // Отправляем детали только в режиме разработки, чтобы не раскрывать структуру БД на продакшене
                message:
                    process.env.NODE_ENV === 'development'
                        ? dbError?.detail || error.message
                        : 'Произошла ошибка при сохранении данных в базу.',
            };

            return; // Прерываем цепочку, ответ сформирован
        }

        // Обработка системных RangeError (например, того самого Maximum call stack size exceeded)
        if (error instanceof RangeError) {
            console.error('\x1b[43m\x1b[30m [KOA RANGE ERROR] \x1b[0m', error.stack);
            ctx.status = 500;
            ctx.body = {
                success: false,
                error: 'Stack overflow or range restriction exceeded',
                message: 'Передано слишком много параметров за один раз.',
            };
            return;
        }

        // Если это любая другая ошибка приложения, пробрасываем её встроенному обработчику Koa
        throw error;
    }
}

// // try {
// await db.transaction(async (tx) => {
//     for (const batch of toDbChunks.info) {
//         await tx.insert(tSsd).values(batch);
//     }
// });
// // } catch (error: unknown) {
// //     if (error instanceof DrizzleQueryError) {
// //         console.error('❌ Запрос Drizzle завершился ошибкой!');
// //         console.error('SQL-текст запроса:', error.message); // Покажет сам SQL

// //         // Настоящая ошибка СУБД (PostgreSQL / MySQL / SQLite) лежит здесь:
// //         const dbError = error.cause as any;

// //         if (dbError) {
// //             console.error('👉 Конкретная причина ошибки:', dbError.message);
// //             console.error('Код ошибки СУБД (SQLState):', dbError.code); // Например, '23505'
// //             console.error('Детали СУБД:', dbError.detail); // Например, 'Key (ID_ssd)=(...) already exists'
// //         }
// //     } else {
// //         // Системные ошибки Node.js (например, Stack Overflow или обрыв сети)
// //         console.error('Нетипичная ошибка:', error);
// //     }
// // }
// // try {
// //     // await db.transaction(async (tx) => {
// //     //     for (const batch of toDbChunks.info) {
// //     //         await tx.insert(tSsd).values(batch);
// //     //     }
// //     // });
// // } catch (error: any) {
// //     console.log('=== ПОДРОБНАЯ ИНФОРМАЦИЯ ОБ ОШИБКЕ ===');

// //     // Показывает абсолютно все скрытые свойства объекта ошибки
// //     console.dir(error, { depth: null });

// //     // Если ошибка пришла из драйвера БД (pg/postgres), у неё будут эти скрытые поля:
// //     if (error.detail) console.error('Детали СУБД:', error.detail); // Например: "Key (id)=(1) already exists"
// //     if (error.code) console.error('Код ошибки PostgreSQL:', error.code); // Например: "23505"
// //     if (error.hint) console.error('Подсказка базы:', error.hint);
// // }
