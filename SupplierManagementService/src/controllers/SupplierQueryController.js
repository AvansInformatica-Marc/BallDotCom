/**
 * @typedef { import('koa').Context } Context
 *
 * @typedef { import('../data-storage/QueryRepository')
 *   .default } QueryRepository
 */

/**
 * API controller for supplier queries
 */
export default class SupplierQueryController {
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
  async getAllSuppliers(ctx) {
    ctx.response.status = 200;
    ctx.response.body = await this.queryRepository.getAllSuppliers();
  }

  /**
   * @param { Context } ctx
   * @returns { Promise<void> }
   */
  async getSupplierById(ctx) {
    const { id } = ctx.params;
    const supplier = await this.queryRepository.getSupplierById(id);
    ctx.response.status = supplier === null ? 404 : 200;
    if (supplier !== null) ctx.response.body = supplier;
  }
}
