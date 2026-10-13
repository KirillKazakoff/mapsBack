import { type BuildQueryResult } from 'drizzle-orm';
import { type relations } from '../drizzle/relations';
import { fetchFullSSD, fetchLastSSD } from '../db/getSSD';

type R = typeof relations;

export type SSDCommonT = Awaited<ReturnType<typeof fetchLastSSD>>[number];
export type SSDFullT = Awaited<ReturnType<typeof fetchFullSSD>>;
// export type SSDCommonT = BuildQueryResult<R, R['tSsd'], { with: { vessel: true } }>;
// export type SSDFullT = BuildQueryResult<
//     R,
//     R['tSsd'],
//     {
//         with: {
//             company: true;
//             catches: {
//                 with: {
//                     vbr: true;
//                     subzone: true;
//                 };
//             };
//             products: {
//                 with: {
//                     product: true;
//                     subzone: true;
//                 };
//             };
//             vessel: true;
//             zoneArrival: true;
//             zoneCurrent: true;
//         };
//     }
// >;
