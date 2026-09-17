import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { readEnv } from '../readEnv';

readEnv();

const db = drizzle(process.env.DATABASE_URL!, { logger: true });

export default db;
