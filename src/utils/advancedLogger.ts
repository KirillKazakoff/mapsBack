import { Logger } from 'drizzle-orm/logger';
console.log('hello');

export class AdvancedDrizzleLogger implements Logger {
    // Логирование успешных запросов (по желанию можно отключить)
    logQuery(query: string, params: unknown[]): void {
        // Если вам нужен чистый терминал в режиме разработки,
        // можете закомментировать строку ниже, чтобы видеть только ОШИБКИ.
        console.log(`\x1b[90m[Drizzle SQL]: ${query}\x1b[0m`);
    }

    // Этот метод Drizzle вызывает, когда СУБД возвращает ошибку
    logError(error: Error, query: string, params: unknown[]): void {
        console.error('\n\x1b[41m\x1b[37m ❌ DRIZZLE QUERY ERROR \x1b[0m');
        console.error(`\x1b[31mMessage:\x1b[0m  ${error.message}`);
        console.error(`\x1b[33mSQL:\x1b[0m      ${query}`);
        console.error(`\x1b[34mParams:\x1b[0m   ${JSON.stringify(params, null, 2)}`);

        // Извлекаем глубокие детали из свойства 'cause' (специфичные для pg, postgres-js, neon)
        const cause = (error as any).cause;
        if (cause) {
            console.error(`\x1b[35m--- DB DETAIL ---\x1b[0m`);
            if (cause.code)
                console.error(`\x1b[36mSQLState (Code):\x1b[0m ${cause.code}`);
            if (cause.detail)
                console.error(`\x1b[36mDB Detail:\x1b[0m       ${cause.detail}`);
            if (cause.hint)
                console.error(`\x1b[36mDB Hint:\x1b[0m         ${cause.hint}`);
            if (cause.where)
                console.error(`\x1b[36mDB Where:\x1b[0m        ${cause.where}`);
        }
        console.error('\x1b[41m\x1b[37m --------------------- \x1b[0m\n');
    }
}
