/**
 * @typedef { import('@peregrine/mongo-connect').MongoDB } MongoDB
 *
 * @typedef { import('../types')
 *   .SupplierEventStoreObject } SupplierEventStoreObject
 * @typedef { import('../types').Supplier } Supplier
 * @typedef { import('../types').SupplierWithId } SupplierWithId
 * @typedef { import('../types').EventTypes } EventTypes
 * @typedef { import('../types').MongoEventRepository } MongoEventRepository
 */

import { supplierEventStoreSchema } from './schema';

export default class EventStoreRepository {
  /**
   * @param { MongoDB } db
   */
  constructor(db) {
    /** @private @type { MongoEventRepository } */
    this.supplierEventStore = db.getMutableRepository(
      'supplier-events',
      supplierEventStoreSchema
    );
  }

  /**
   * @param { Supplier } supplier
   * @returns { Promise<SupplierWithId | null> }
   */
  async addItem(supplier) {
    try {
      const model = await this.supplierEventStore.add({
        events: [
          {
            eventType: 'createResource',
            eventName: 'Created',
            eventDate: new Date(),
            ...supplier,
          },
        ],
      });
      return { id: model.id, ...supplier };
    } catch (err) {
      return null;
    }
  }

  /**
   * @param { string } id
   * @param { Partial<Supplier> } supplier
   * @param { EventTypes } eventType
   * @param { string } eventName
   * @returns { Promise<Partial<SupplierWithId> | null> }
   */
  async addEvent(id, supplier, eventType, eventName) {
    try {
      const model = await this.supplierEventStore.getById(id);
      if (model === null) return null;

      model.events.push({
        eventType,
        eventName,
        eventDate: new Date(),
        ...supplier,
      });

      await this.supplierEventStore.update(id, model);

      return { id, ...supplier };
    } catch (err) {
      return null;
    }
  }
}
