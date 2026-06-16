import http from 'http';
import Koa from 'koa';
import router from './routes/router';
import koaBody from 'koa-body';
import cors from '@koa/cors';
import db from './db/db';
import { drizzleErrorMiddleware } from './utils/error-middleware';

const app = new Koa();
app.proxy = true;

app.use(drizzleErrorMiddleware);
app.use(
    cors({
        origin: '*',
        allowMethods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'UPDATE'],
    })
);
app.use(
    koaBody({ json: true, jsonLimit: '500mb', formLimit: '10mb', textLimit: '10mb' })
);
app.use(router());

const port = 9092;
const server = http.createServer(app.callback()).listen(port);

server.on('close', () => {
    console.log('close');
});
server.on('error', (e) => {
    console.log(e.message);
});

console.log('ready');
