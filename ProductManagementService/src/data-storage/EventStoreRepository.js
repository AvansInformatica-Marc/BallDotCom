/**
 * @typedef { import('@peregrine/mongo-connect').MongoDB } MongoDB
 *
 * @typedef { import('../types')
 *   .ProductEventStoreObject } ProductEventStoreObject
 * @typedef { import('../types').Product } Product
 * @typedef { import('../types').ProductWithId } ProductWithId
 * @typedef { import('../types').EventTypes } EventTypes
 * @typedef { import('../types').MongoEventRepository } MongoEventRepository
 */

import { productEventStoreSchema } from './schema';

export default class EventStoreRepository {
  /**
   * @param { MongoDB } db
   */
  constructor(db) {
    /** @private @type { MongoEventRepository } */
    this.productEventStore = db.getMutableRepository(
      'product-events',
      productEventStoreSchema
    );
  }

  /**
   * @param { Product } product
   * @returns { Promise<ProductWithId | null> }
   */
  async addItem(product) {
    try {
      const model = await this.productEventStore.add({
        events: [
          {
            eventType: 'createResource',
            eventName: 'Created',
            eventDate: new Date(),
            ...product,
          },
        ],
      });
      return { id: model.id, ...product };
    } catch (err) {
      return null;
    }
  }

  /**
   * @param { string } id
   * @param { Partial<Product> } product
   * @param { EventTypes } eventType
   * @param { string } eventName
   * @returns { Promise<Partial<ProductWithId> | null> }
   */
  async addEvent(id, product, eventType, eventName) {
    try {
      const model = await this.productEventStore.getById(id);
      if (model === null) return null;

      model.events.push({
        eventType,
        eventName,
        eventDate: new Date(),
        ...product,
      });

      await this.productEventStore.update(id, model);

      return { id, ...product };
    } catch (err) {
      return null;
    }
  }
}
