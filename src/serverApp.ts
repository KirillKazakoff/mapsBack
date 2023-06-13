import http from 'http';
import Koa from 'koa';
import router from './routes/router';
import koaBody from 'koa-body';
import cors from '@koa/cors';
import db from './db/db';

const app = new Koa();

app.use(cors());
app.use(koaBody({ json: true }));
app.use(router());

const port = 9092;
const server = http.createServer(app.callback()).listen(port);

server.on('close', () => {
    db.end();
});
server.on('error', () => {
    db.end();
});

console.log('ready');
