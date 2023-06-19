import Router from 'koa-router';
import { addSSDInfo, getSsdByVesselId, getSSDInfoByVesselId } from '../db/controller';
import { getVessels, getVesselById, updateZones } from '../db/controller';

const router = new Router();

router.post('/zones', updateZones);

router.post('/ssd', addSSDInfo);
router.get('/ssd/:id', getSSDInfoByVesselId);

router.get('/vessel', getVessels);
router.get('/vessel/:id', getVesselById);

export default router;
