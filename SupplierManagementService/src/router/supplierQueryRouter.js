/**
 * @typedef { import('../data-storage/QueryRepository')
 *   .default } QueryRepository
 */

import Router from '@koa/router';

import SupplierQueryController from '../controllers/SupplierQueryController';

/**
 * @param { QueryRepository } queryRepository
 * @returns { Router<any, {}> }
 */
export default function createSupplierQueryRouter(queryRepository) {
  const controller = new SupplierQueryController(queryRepository);

  const router = new Router();
  router.get('/', (ctx) => controller.getAllSuppliers(ctx));
  router.get('/:id', (ctx) => controller.getSupplierById(ctx));

  return router;
}
