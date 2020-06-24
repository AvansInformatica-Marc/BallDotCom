/**
 * @typedef { import('koa').Context } Context
 *
 * @typedef { import('../data-storage/QueryRepository')
 *   .default } QueryRepository
 */

/**
 * API controller for product queries
 */
export default class ProductQueryController {
  /**
   * @param { QueryRepository } queryRepository
   */
  constructor(queryRepository) {
    /** @private */
    this.queryRepository = queryRepository;
  }

  /**
   * @param { Context } ctx
   * @returns { Promise<void> }
   */
  async getAllProducts(ctx) {
    ctx.response.status = 200;
    ctx.response.body = await this.queryRepository.getAllProducts();
  }

  /**
   * @param { Context } ctx
   * @returns { Promise<void> }
   */
  async getProductById(ctx) {
    const { id } = ctx.params;
    const product = await this.queryRepository.getProductById(id);
    ctx.response.status = product === null ? 404 : 200;
    if (product !== null) ctx.response.body = product;
  }
}
