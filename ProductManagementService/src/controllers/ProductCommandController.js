/**
 * @typedef { import('koa').Context } Context
 *
 * @typedef { import('../types/Product').Product } Product
 * @typedef { import('../ProductCommandHandler')
 *   .default } ProductCommandHandler
 */

/**
 * API controller for product commands
 */
export default class ProductCommandController {
  /**
   * @param { ProductCommandHandler } commandHandler
   * @param { (id: string) => Promise<boolean> } doesSupplierExist
   */
  constructor(commandHandler, doesSupplierExist) {
    /** @private */
    this.commandHandler = commandHandler;
    /** @private */
    this.doesSupplierExist = doesSupplierExist;
  }

  /**
   * @private
   * @param { any } product
   * @returns { product is Product }
   */
  static isProductValid(product) {
    return (
      `name` in product &&
      typeof product.name === `string` &&
      `supplier` in product &&
      typeof product.supplier === `string` &&
      `price` in product &&
      typeof product.price === `number` &&
      `stock` in product &&
      typeof product.stock === `number`
    );
  }

  /**
   * @param { Context } ctx
   * @returns { Promise<void> }
   */
  async createProduct(ctx) {
    const requestBody = ctx.request.body;
    if (
      !ProductCommandController.isProductValid(requestBody) ||
      !(await this.doesSupplierExist(requestBody.supplier))
    ) {
      ctx.response.status = 400;
    } else {
      const product = await this.commandHandler.createProduct(requestBody);
      ctx.response.body = product;
      ctx.response.status = 201;
    }
  }

  /**
   * @param { Context } ctx
   * @returns { Promise<void> }
   */
  async updateProduct(ctx) {
    const requestBody = ctx.request.body;
    const eventName = ctx.request.headers['event-name'];
    if (
      !ProductCommandController.isProductValid(requestBody) ||
      typeof eventName !== 'string' ||
      !(await this.doesSupplierExist(requestBody.supplier))
    ) {
      ctx.response.status = 400;
    } else {
      const { id } = ctx.params;
      const updatedProduct = await this.commandHandler.updateProduct(
        id,
        requestBody,
        eventName
      );
      ctx.response.status = updatedProduct === null ? 404 : 200;

      if (updatedProduct !== null) ctx.response.body = updatedProduct;
    }
  }

  /**
   * @param { Context } ctx
   * @returns { Promise<void> }
   */
  async deleteProduct(ctx) {
    const { id } = ctx.params;
    const eventName = ctx.request.headers['event-name'];
    if (typeof eventName !== 'string') {
      ctx.response.status = 400;
    } else {
      const deletedProduct = await this.commandHandler.deleteProduct(
        id,
        eventName
      );
      ctx.response.status = deletedProduct === null ? 404 : 204;
    }
  }
}
