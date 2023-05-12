import Router from 'koa-router';
import { addSsd, getSsd, getSsdById } from '../db/controller';

const router = new Router();

router.post('/ssd', addSsd);
router.get('/ssd', getSsd);
router.get('/ssd/:id', getSsdById);

export default router;
