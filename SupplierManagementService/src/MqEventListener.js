/**
 * @typedef { import('./data-storage/QueryRepository').default } QueryRepository
 */

/**
 * Listens for messages from RabbitMQ and saves new suppliers in the query DB
 */
export default class MqEventListener {
  /**
   * @param { QueryRepository } queryRepository
   */
  constructor(queryRepository) {
    /** @private */
    this.queryRepository = queryRepository;
  }

  /**
   * @param { string } data
   * @returns { Promise<boolean> }
   */
  async onSupplierMessageReceived(data) {
    const { eventType, supplier } = JSON.parse(data);

    let result = null;

    if (eventType === 'createResource') {
      result = await this.queryRepository.addSupplier(supplier);
    } else if (eventType === 'updateResource') {
      const { id, ...rest } = supplier;
      result = await this.queryRepository.updateSupplier(id, rest);
    } else if (eventType === 'deleteResource') {
      result = await this.queryRepository.deleteSupplier(supplier.id);
    }

    return result !== null;
  }
}
