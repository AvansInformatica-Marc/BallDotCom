declare module 'swagger-injector' {
  import Koa from 'koa';

  type KoaCtx = Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext>;
  type KoaMiddleware = Koa.Middleware<KoaCtx>;

  interface Params {
    path?: string
    swagger?: false | string
    prefix?: string
    assets?: string
    route?: string
    css?: false | string
    unauthorized?: boolean | ((...args: any[]) => any)
    dist?: string
    authentication?: {
      sources?: string[]
      key?: false | string
      value?: false | string
    }
  }

  export function koa(params: Params): KoaMiddleware;
  export function express(params: Params): any;
}
