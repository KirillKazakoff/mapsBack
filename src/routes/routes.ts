import Router from 'koa-router';
import { addSSDInfo } from '../db/addSSDInfo';
import { getSSDById, getLastSSD } from '../db/getSSD';
import { getVessels } from '../db/getVessels';

const router = new Router();
// router.post('/zones', updateZones);

router.post('/ssd', addSSDInfo);
router.post('/debug', addSSDInfo);
router.get('/vessels/all', getVessels);
router.get('/ssd/:id', getSSDById);
router.get('/ssd', getLastSSD);

export default router;
