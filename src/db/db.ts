import { Pool } from 'pg';

const db = new Pool({
    user: 'kirillkazakov',
    password: 'root',
    host: 'localhost',
    port: 5432,
    database: 'postgress',
});

export default db;
