import { Supplier } from './Supplier';
import { EventTypes } from './EventTypes';

interface Event {
    eventType: EventTypes
    eventName: string
    eventDate: Date
}

interface SupplierEvent extends Event, Partial<Supplier> {}

export interface SupplierEventStoreObject {
    events: SupplierEvent[]
}

export interface SupplierEventStoreObjectWithId extends SupplierEventStoreObject {
    id: string
}
