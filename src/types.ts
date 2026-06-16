import { ParameterizedContext } from 'koa';
import Router from 'koa-router';

export type CtxT = ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>;

export type SSDInfoT = {
    id: string;
    vessel_name: string;
    company_id: string;
    agreement_no: string;
    catch_zone_id: string;
    isTransport: boolean;
    trapData: {
        amount: number;
        amountStr: string;
        desc: string;
    }[];
    isOutdated: boolean;
    status: {
        main: string;
        place: string;
        placeId: number;
        event: {
            time: number;
            type: string;
        }[];
        destination: {
            eta: string;
            place: string;
            placeId: number;
        };
    };
    vessel_id: string;
    date: string;
    coordinates: string;
};
export type ProductionInputT = {
    id: number;
    idSubzone: number;
    idQuote: number;
    name: string;
    total: number;
};
export type ProductionOutputT = {
    idProduct: number;
    idSubzone: number;
    idQuote: number;
    name: string;
    total: number;
    sort: string;
    coefficient: number;
};

export type SSDT = {
    info: SSDInfoT;
    production: {
        input: ProductionInputT[];
        output: {
            current: ProductionOutputT[];
            board: ProductionOutputT[];
        };
        isLive: boolean;
    };
    type?: string;
};

// export type SSDInfoSoleT = {
//     ssd: SSD;
//     productionDetails: ProductionDetails[];
//     productionInput: ProductionInput;
//     productionTransport: ProductionTransport[];
//     reserve: Reserve;
//     bait: Bait[];
// };
