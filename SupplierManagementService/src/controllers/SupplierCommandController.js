/**
 * @typedef { import('koa').Context } Context
 *
 * @typedef { import('../types/Supplier').Supplier } Supplier
 * @typedef { import('../SupplierCommandHandler')
 *   .default } SupplierCommandHandler
 */

/**
 * API controller for supplier commands
 */
export default class SupplierCommandController {
  /**
   * @param { SupplierCommandHandler } commandHandler
   */
  constructor(commandHandler) {
    /** @private */
    this.commandHandler = commandHandler;
  }

  /**
   * @private
   * @param { any } supplier
   * @returns { supplier is Supplier }
   */
  static isSupplierValid(supplier) {
    return 'name' in supplier && typeof supplier.name === 'string';
  }

  /**
   * @param { Context } ctx
   * @returns { Promise<void> }
   */
  async createSupplier(ctx) {
    const requestBody = ctx.request.body;
    if (!SupplierCommandController.isSupplierValid(requestBody)) {
      ctx.response.status = 400;
    } else {
      const supplier = await this.commandHandler.createSupplier(requestBody);
      ctx.response.body = supplier;
      ctx.response.status = 201;
    }
  }

  /**
   * @param { Context } ctx
   * @returns { Promise<void> }
   */
  async updateSupplier(ctx) {
    const requestBody = ctx.request.body;
    const eventName = ctx.request.headers['event-name'];
    if (
      !SupplierCommandController.isSupplierValid(requestBody) ||
      typeof eventName !== 'string'
    ) {
      ctx.response.status = 400;
    } else {
      const { id } = ctx.params;
      const updatedSupplier = await this.commandHandler.updateSupplier(
        id,
        requestBody,
        eventName
      );
      ctx.response.status = updatedSupplier === null ? 404 : 200;

      if (updatedSupplier !== null) ctx.response.body = updatedSupplier;
    }
  }

  /**
   * @param { Context } ctx
   * @returns { Promise<void> }
   */
  async deleteSupplier(ctx) {
    const { id } = ctx.params;
    const eventName = ctx.request.headers['event-name'];
    if (typeof eventName !== 'string') {
      ctx.response.status = 400;
    } else {
      const deletedSupplier = await this.commandHandler.deleteSupplier(
        id,
        eventName
      );
      ctx.response.status = deletedSupplier === null ? 404 : 204;
    }
  }
}
