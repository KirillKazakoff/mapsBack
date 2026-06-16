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
