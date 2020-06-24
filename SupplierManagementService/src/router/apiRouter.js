/**
 * @typedef { import('@peregrine/mq-lib').MqService } MqService
 *
 * @typedef { import('../data-storage/QueryRepository')
 *   .default } QueryRepository
 * @typedef { import('../data-storage/EventStoreRepository')
 *   .default } EventStoreRepository
 * @typedef { import('../types/Json').Json } Json
 */

import Router from '@koa/router';

import createSupplierCommandRouter from './supplierCommandRouter';
import createSupplierQueryRouter from './supplierQueryRouter';

/**
 * @param { QueryRepository } queryRepository
 * @param { EventStoreRepository } eventStoreRepository
 * @param { MqService } rabbitMqService
 * @returns { Router<any, {}> }
 */
export default function createApiRouter(
  queryRepository,
  eventStoreRepository,
  rabbitMqService
) {
  const sendMessage = (
    /** @type { string } */ queueName,
    /** @type { Json } */ data
  ) => {
    return rabbitMqService.sendMessage(queueName, data);
  };

  const router = new Router();

  router.use(
    '/supplier',
    createSupplierQueryRouter(queryRepository).routes(),
    createSupplierCommandRouter(eventStoreRepository, sendMessage).routes()
  );

  return router;
}
