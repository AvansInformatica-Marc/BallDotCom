/**
 * @typedef { import('@peregrine/mongo-connect').MongoDB } MongoDB
 *
 * @typedef { import('../types').Product } Product
 * @typedef { import('../types').ProductWithId } ProductWithId
 * @typedef { import('../types').Supplier } Supplier
 * @typedef { import('../types').SupplierWithId } SupplierWithId
 * @typedef { import('../types')
 *   .MongoProductQueryRepository } MongoProductQueryRepository
 * @typedef { import('../types')
 *   .MongoSupplierQueryRepository } MongoSupplierQueryRepository
 */

import { productSchema, supplierSchema } from './schema';

export default class QueryRepository {
  /**
   * @param { MongoDB } db
   */
  constructor(db) {
    /** @private @type { MongoProductQueryRepository } */
    this.productQueryModel = db.getMutableNullableRepository(
      'products',
      productSchema
    );

    /** @private @type { MongoSupplierQueryRepository } */
    this.supplierQueryModel = db.getMutableNullableRepository(
      'suppliers',
      supplierSchema
    );
  }

  /**
   * @returns { Promise<ProductWithId[]> }
   */
  async getAllProducts() {
    return (await this.productQueryModel.getAll()) ?? [];
  }

  /**
   * @param { string } id
   * @returns { Promise<ProductWithId | null> }
   */
  async getProductById(id) {
    return this.productQueryModel.getById(id);
  }

  /**
   * @param { ProductWithId } product
   * @returns { Promise<ProductWithId | null> }
   */
  async addProduct(product) {
    return this.productQueryModel.addObjectWithId(product);
  }

  /**
   * @param { string } id
   * @param { Product } product
   * @returns { Promise<ProductWithId | null> }
   */
  async updateProduct(id, product) {
    return this.productQueryModel.patch(id, product);
  }

  /**
   * @param { string } id
   * @returns { Promise<ProductWithId | null> }
   */
  async deleteProduct(id) {
    return this.productQueryModel.delete(id);
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
