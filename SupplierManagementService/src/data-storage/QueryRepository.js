/**
 * @typedef { import('@peregrine/mongo-connect').MongoDB } MongoDB
 *
 * @typedef { import('../types').Supplier } Supplier
 * @typedef { import('../types').SupplierWithId } SupplierWithId
 * @typedef { import('../types').MongoQueryRepository } MongoQueryRepository
 */

import { supplierSchema } from './schema';

export default class QueryRepository {
  /**
   * @param { MongoDB } db
   */
  constructor(db) {
    /** @private @type { MongoQueryRepository } */
    this.supplierQueryModel = db.getMutableNullableRepository(
      'suppliers',
      supplierSchema
    );
  }

  /**
   * @returns { Promise<SupplierWithId[]> }
   */
  async getAllSuppliers() {
    return (await this.supplierQueryModel.getAll()) ?? [];
  }

  /**
   * @param { string } id
   * @returns { Promise<SupplierWithId | null> }
   */
  async getSupplierById(id) {
    return this.supplierQueryModel.getById(id);
  }

  /**
   * @param { SupplierWithId } supplier
   * @returns { Promise<SupplierWithId | null> }
   */
  async addSupplier(supplier) {
    return this.supplierQueryModel.addObjectWithId(supplier);
  }

  /**
   * @param { string } id
   * @param { Supplier } supplier
   * @returns { Promise<SupplierWithId | null> }
   */
  async updateSupplier(id, supplier) {
    return this.supplierQueryModel.patch(id, supplier);
  }

  /**
   * @param { string } id
   * @returns { Promise<SupplierWithId | null> }
   */
  async deleteSupplier(id) {
    return this.supplierQueryModel.delete(id);
  }
}
