export * from './EventTypes';
export * from './Json';
export * from './MqMessageSender';
export * from './Supplier';
export * from './SupplierEventStoreObject';

import { MutableRepository } from '@peregrine/mongo-connect';
import { Supplier } from './Supplier';
import { SupplierEventStoreObject } from './SupplierEventStoreObject';

export type MongoQueryRepository = MutableRepository<Supplier, null>;
export type MongoEventRepository = MutableRepository<SupplierEventStoreObject>;
