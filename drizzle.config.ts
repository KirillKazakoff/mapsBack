import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { readEnv } from './src/readEnv';

readEnv();
export default defineConfig({
    out: './drizzle',
    schema: './src/drizzle/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
