/**
 * @typedef { import('../data-storage/EventStoreRepository')
 *   .default } EventStoreRepository
 * @typedef { import('../data-storage/QueryRepository')
 *   .default } QueryRepository
 * @typedef { import('../types/MqMessageSender')
 *   .MqMessageSender } MqMessageSender
 */

import Router from '@koa/router';

import ProductCommandController from '../controllers/ProductCommandController';
import ProductCommandHandler from '../ProductCommandHandler';

/**
 * @param { EventStoreRepository } eventStoreRepository
 * @param { QueryRepository } queryRepository
 * @param { MqMessageSender } sendMqMessage
 * @returns { Router<any, {}> }
 */
export default function createProductCommandRouter(
  eventStoreRepository,
  queryRepository,
  sendMqMessage
) {
  const commandHandler = new ProductCommandHandler(
    eventStoreRepository,
    sendMqMessage
  );

  const controller = new ProductCommandController(
    commandHandler,
    async (id) => {
      const supplier = await queryRepository.getSupplierById(id);
      return supplier !== null;
    }
  );

  const router = new Router();
  router.post('/', (ctx) => controller.createProduct(ctx));
  router.put('/:id', (ctx) => controller.updateProduct(ctx));
  router.delete('/:id', (ctx) => controller.deleteProduct(ctx));

  return router;
}
