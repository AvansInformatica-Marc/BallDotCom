/**
 * @typedef { import('../data-storage/QueryRepository')
 *   .default } QueryRepository
 */

import Router from '@koa/router';

import ProductQueryController from '../controllers/ProductQueryController';

/**
 * @param { QueryRepository } queryRepository
 * @returns { Router<any, {}> }
 */
export default function createProductQueryRouter(queryRepository) {
  const controller = new ProductQueryController(queryRepository);

  const router = new Router();
  router.get('/', (ctx) => controller.getAllProducts(ctx));
  router.get('/:id', (ctx) => controller.getProductById(ctx));

  return router;
}
