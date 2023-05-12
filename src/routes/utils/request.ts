export const request = (callback: any, ctx: any) => {
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
