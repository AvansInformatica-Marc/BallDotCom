/**
 * @typedef { import('./data-storage/EventStoreRepository')
 *   .default } EventStoreRepository
 * @typedef { import('./types/Supplier').Supplier } Supplier
 * @typedef { import('./types/Supplier').SupplierWithId } SupplierWithId
 * @typedef { import('./types/EventTypes').EventTypes } EventTypes
 * @typedef { import('./types/MqMessageSender')
 *   .MqMessageSender } MqMessageSender
 */

/**
 * Retreives commands and sents them to RabbitMQ and the event store
 */
export default class SupplierCommandHandler {
  /**
   * @param { EventStoreRepository } eventStoreRepository
   * @param { MqMessageSender } sendMqMessage
   */
  constructor(eventStoreRepository, sendMqMessage) {
    /** @private */
    this.eventStoreRepository = eventStoreRepository;
    /** @private */
    this.sendMqMessage = sendMqMessage;
  }

  /**
   * @param { Supplier } supplier
   * @returns { Promise<SupplierWithId | null> }
   */
  async createSupplier(supplier) {
    const savedSupplier = await this.eventStoreRepository.addItem(supplier);

    if (savedSupplier !== null)
      this.sendMqMessage('supplier', {
        eventType: 'createResource',
        supplier: { ...savedSupplier },
      });

    return savedSupplier;
  }

  /**
   * @private
   * @param { string } id
   * @param { Partial<Supplier> } supplier
   * @param { EventTypes } eventType
   * @param { string } eventName
   * @returns { Promise<Partial<SupplierWithId> | null > }
   */
  async updateSupplierWithType(id, supplier, eventType, eventName) {
    const savedSupplier = await this.eventStoreRepository.addEvent(
      id,
      supplier,
      eventType,
      eventName
    );

    if (savedSupplier !== null)
      this.sendMqMessage('supplier', {
        eventType,
        supplier: { ...savedSupplier },
      });

    return savedSupplier;
  }

  /**
   * @param { string } id
   * @param { Supplier } supplier
   * @param { string } eventName
   * @returns { Promise<Partial<SupplierWithId> | null > }
   */
  async updateSupplier(id, supplier, eventName) {
    return this.updateSupplierWithType(
      id,
      supplier,
      'updateResource',
      eventName
    );
  }

  /**
   * @param { string} id
   * @param { string } eventName
   * @returns { Promise<Partial<SupplierWithId> | null > }
   */
  async deleteSupplier(id, eventName) {
    return this.updateSupplierWithType(id, {}, 'deleteResource', eventName);
  }
}
