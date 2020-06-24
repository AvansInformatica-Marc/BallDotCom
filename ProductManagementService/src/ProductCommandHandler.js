/**
 * @typedef { import('./data-storage/EventStoreRepository')
 *   .default } EventStoreRepository
 * @typedef { import('./types/Product').Product } Product
 * @typedef { import('./types/Product').ProductWithId } ProductWithId
 * @typedef { import('./types/EventTypes').EventTypes } EventTypes
 * @typedef { import('./types/MqMessageSender')
 *   .MqMessageSender } MqMessageSender
 */

/**
 * Retreives commands and sents them to RabbitMQ and the event store
 */
export default class ProductCommandHandler {
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
   * @param { Product } product
   * @returns { Promise<ProductWithId | null> }
   */
  async createProduct(product) {
    const savedProduct = await this.eventStoreRepository.addItem(product);

    if (savedProduct !== null)
      this.sendMqMessage('product', {
        eventType: 'createResource',
        product: { ...savedProduct },
      });

    return savedProduct;
  }

  /**
   * @private
   * @param { string } id
   * @param { Partial<Product> } product
   * @param { EventTypes } eventType
   * @param { string } eventName
   * @returns { Promise<Partial<ProductWithId> | null > }
   */
  async updateProductWithType(id, product, eventType, eventName) {
    const savedProduct = await this.eventStoreRepository.addEvent(
      id,
      product,
      eventType,
      eventName
    );

    if (savedProduct !== null)
      this.sendMqMessage('product', {
        eventType,
        product: { ...savedProduct },
      });

    return savedProduct;
  }

  /**
   * @param { string } id
   * @param { Product } product
   * @param { string } eventName
   * @returns { Promise<Partial<ProductWithId> | null > }
   */
  async updateProduct(id, product, eventName) {
    return this.updateProductWithType(id, product, 'updateResource', eventName);
  }

  /**
   * @param { string} id
   * @param { string } eventName
   * @returns { Promise<Partial<ProductWithId> | null > }
   */
  async deleteProduct(id, eventName) {
    return this.updateProductWithType(id, {}, 'deleteResource', eventName);
  }
}
