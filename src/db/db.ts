import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { readEnv } from '../readEnv';
import { relations } from '../drizzle/relations';

readEnv();

const db = drizzle(process.env.DATABASE_URL!, {
    relations,
    logger: true,
});

export default db;
