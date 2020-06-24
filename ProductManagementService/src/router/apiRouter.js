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

import createProductCommandRouter from './productCommandRouter';
import createProductQueryRouter from './productQueryRouter';

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
    '/product',
    createProductQueryRouter(queryRepository).routes(),
    createProductCommandRouter(
      eventStoreRepository,
      queryRepository,
      sendMessage
    ).routes()
  );

  return router;
}
