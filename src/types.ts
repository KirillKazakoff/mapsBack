import { ParameterizedContext } from 'koa';
import Router from 'koa-router';

export type CtxT = ParameterizedContext<any, Router.IRouterParamContext<any, {}>, any>;
