import combineRouters from 'koa-combine-routers';

import pingRouter from './ping';
import messageRouter from './coordinates';

const router = combineRouters(pingRouter, messageRouter);

export default router;
