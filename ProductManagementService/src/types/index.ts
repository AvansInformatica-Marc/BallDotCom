export * from './EventTypes';
export * from './Json';
export * from './MqMessageSender';
export * from './Supplier';
export * from './Product';
export * from './ProductEventStoreObject';

import { MutableRepository } from '@peregrine/mongo-connect';
import { Product } from './Product';
import { Supplier } from './Supplier';
import { ProductEventStoreObject } from './ProductEventStoreObject';

export type MongoProductQueryRepository = MutableRepository<Product, null>;
export type MongoSupplierQueryRepository = MutableRepository<Supplier, null>;
export type MongoEventRepository = MutableRepository<ProductEventStoreObject>;
