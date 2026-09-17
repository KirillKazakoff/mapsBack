import dotenv from 'dotenv';
import path from 'path';

export const environment = process.env.NODE_ENV || 'development';

export const readEnv = () => {
    dotenv.config({
        quiet: true,
        path: path.resolve(process.cwd(), `.env.${environment}`),
    });
};
