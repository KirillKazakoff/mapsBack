import Router from 'koa-router';
import { addSsdList } from '../db/controller';
import {
    getSsd,
    getSsdById,
    getVessels,
    getVesselById,
    updateZones,
} from '../db/controller';

const router = new Router();

router.post('/zones', updateZones);

router.post('/ssd', addSsdList);
router.get('/ssd', getSsd);
router.get('/ssd/:id', getSsdById);

router.get('/vessel', getVessels);
router.get('/vessel/:id', getVesselById);

export default router;
