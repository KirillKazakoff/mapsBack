import Router from 'koa-router';
// import { addSSDInfo, getSSDInfoByVesselId, updateCoordinates } from '../db/controller';
// import { getVessels, getVesselById, updateZones } from '../db/controller';

import { addSSDInfo } from '../db/addSSDInfo';
import { getVessels } from '../db/getVessels';

const router = new Router();
// router.post('/zones', updateZones);

router.post('/ssd', addSSDInfo);
router.post('/debug', addSSDInfo);
router.get('/vessels/all', getVessels);
// router.post('/debug', insertVessel);
// router.post('/debug', deleteVessel);

// router.get('/ssd/:id', getSSDInfoByVesselId);

// router.post('/coordinates', updateCoordinates);
// router.get('/vessels/:companyId', getVessels);
// router.get('/vesselsById/:id', getVesselById);

export default router;
