/**
 * @typedef { import('../data-storage/EventStoreRepository')
 *   .default } EventStoreRepository
 * @typedef { import('../types/MqMessageSender')
 *   .MqMessageSender } MqMessageSender
 */

import Router from '@koa/router';

import SupplierCommandController from '../controllers/SupplierCommandController';
import SupplierCommandHandler from '../SupplierCommandHandler';

/**
 * @param { EventStoreRepository } eventStoreRepository
 * @param { MqMessageSender } sendMqMessage
 * @returns { Router<any, {}> }
 */
export default function createSupplierCommandRouter(
  eventStoreRepository,
  sendMqMessage
) {
  const commandHandler = new SupplierCommandHandler(
    eventStoreRepository,
    sendMqMessage
  );
  const controller = new SupplierCommandController(commandHandler);

  const router = new Router();
  router.post('/', (ctx) => controller.createSupplier(ctx));
  router.put('/:id', (ctx) => controller.updateSupplier(ctx));
  router.delete('/:id', (ctx) => controller.deleteSupplier(ctx));

  return router;
}
