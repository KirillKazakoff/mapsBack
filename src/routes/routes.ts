import Router from 'koa-router';
import { addSSDInfo, getSSDInfoByVesselId } from '../db/controller';
import { getVessels, getVesselById, updateZones } from '../db/controller';

const router = new Router();

router.post('/zones', updateZones);

router.post('/ssd', addSSDInfo);
router.get('/ssd/:id', getSSDInfoByVesselId);

router.get('/vessels/:companyId', getVessels);
router.get('/vesselsById/:id', getVesselById);

export default router;
