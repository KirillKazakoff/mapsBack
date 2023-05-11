import Router from 'koa-router';

const router = new Router();

const request = (callback: any, ctx: any) => {
    try {
        const res = callback();
        if (ctx.method === 'GET') return res;
        ctx.response.body = { ok: 'ok' };
        return true;
    } catch (e: any) {
        ctx.response.status = +e.message;
        return false;
    }
};

// post router
router.post('/coordinates', async (ctx) => {
    const coordinates = ctx.request.body;

    console.log(coordinates);
});

export default router;
