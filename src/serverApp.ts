import Koa from 'koa';
import router from './routes/router';
import koaBody from 'koa-body';
import cors from '@koa/cors';
import { drizzleErrorMiddleware } from './utils/error-middleware';
import { readEnv, environment } from './readEnv';
import { bot } from './db/bot';

readEnv();

const app = new Koa();
app.proxy = true;

app.use(drizzleErrorMiddleware);
app.use(
    cors({
        origin: '*',
        allowMethods: ['GET', 'POST', 'OPTIONS', 'DELETE', 'UPDATE'],
    })
);
app.use(koaBody({ json: true, jsonLimit: '500mb', formLimit: '10mb', textLimit: '10mb' }));
app.use(router());

const port = process.env.PORT;
const server = app.listen(port);

server.on('close', () => {
    console.log('close');
});
server.on('error', (e: any) => {
    console.log(e.message);
});

bot.logDate(`backend server is working... \nstatus: ${environment}`);
