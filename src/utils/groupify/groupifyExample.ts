// type RowT2 = {
//     count: number;
//     blNo: string;
//     vessel: string;
//     product: string;
//     sort: string;
// };

// const inputParams = (row: RowT2) => ({
//     code: row.blNo,
//     init: () => 'somefn',
//     groupedBy: {
//         vessel: { code: row.vessel },
//         product: {
//             code: row.product,
//             groupedBy: {
//                 sort: { code: row.sort },
//             },
//         },
//     },
// });

// const outputResAssociative = {
//     'bl-21': {
//         code: 'bl-21',
//         rows: [1, 2, 3, 4, 5, 6, 7, 8],
//         total: 10,
//         groupedBy: {
//             vessel: {
//                 harbiz: {
//                     code: 'harbiz',
//                     rows: [1, 2],
//                     total: 3,
//                 },
//                 atka: {
//                     code: 'atka',
//                     rows: [3, 4],
//                     total: 7,
//                 },
//             },
//             product: {
//                 kamchatskiy: {
//                     code: 'kamchatskiy',
//                     rows: [1, 2, 3, 4],
//                     total: 10,
//                     groupedBy: {
//                         sort: {
//                             L: {
//                                 code: 'L',
//                                 rows: [1, 2],
//                                 total: 3,
//                             },
//                             M: {
//                                 code: 'M',
//                                 rows: [3, 4],
//                                 total: 7,
//                             },
//                         },
//                     },
//                 },
//                 siniy: {
//                     code: 'siniy',
//                     rows: [1, 2, 5, 6],
//                     total: 14,
//                     groupedBy: {
//                         sort: {
//                             L: {
//                                 code: 'L',
//                                 rows: [1, 2],
//                                 total: 3,
//                             },
//                             M: {
//                                 code: 'M',
//                                 rows: [5, 6],
//                                 total: 11,
//                             },
//                         },
//                     },
//                 },
//             },
//         },
//     },
// };

// const outputResArray = [
//     {
//         code: 'bl-21',
//         rows: [1, 2, 3, 4, 5, 6, 7, 8],
//         total: 10,
//         groupedBy: {
//             vessel: [
//                 {
//                     code: 'harbiz',
//                     rows: [1, 2],
//                     total: 3,
//                 },
//                 {
//                     code: 'atka',
//                     rows: [3, 4],
//                     total: 7,
//                 },
//             ],
//             product: [
//                 {
//                     code: 'kamchatskiy',
//                     rows: [1, 2, 3, 4],
//                     total: 10,
//                     groupedBy: {
//                         sort: [
//                             {
//                                 code: 'L',
//                                 rows: [1, 2],
//                                 total: 3,
//                             },
//                             {
//                                 code: 'M',
//                                 rows: [3, 4],
//                                 total: 7,
//                             },
//                         ],
//                     },
//                 },
//                 {
//                     code: 'siniy',
//                     rows: [1, 2, 5, 6],
//                     total: 14,
//                     groupedBy: {
//                         sort: [
//                             {
//                                 code: 'L',
//                                 rows: [1, 2],
//                                 total: 3,
//                             },
//                             {
//                                 code: 'M',
//                                 rows: [5, 6],
//                                 total: 11,
//                             },
//                         ],
//                     },
//                 },
//             ],
//         },
//     },
// ];
