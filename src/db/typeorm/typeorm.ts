import { createConnection } from 'typeorm';
import { Banker } from './entities/Banker';
import { Client } from './entities/Client';
import { Transaction } from './entities/Transaction';

export const main = async () => {
    try {
        await createConnection({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'kirillkazakov',
            password: 'root',
            database: 'kirillkazakov',
            entities: [Client, Banker, Transaction],
            synchronize: true,
        });
        console.log('connected to db');
    } catch (e) {
        console.log('unable to connect postgres');
        throw new Error('');
    }
};
