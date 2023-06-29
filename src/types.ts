import { ParameterizedContext } from 'koa';
import Router from 'koa-router';
import {
    SSD,
    ProductionDetails,
    ProductionInput,
    Reserve,
    Bait,
    Vessel,
    ProductionTransport,
} from './models/models';

export type CtxT = ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>;

export type SSDInfoSoleT = {
    ssd: SSD;
    productionDetails: ProductionDetails[];
    productionInput: ProductionInput;
    productionTransport: ProductionTransport[];
    reserve: Reserve;
    bait: Bait[];
};
