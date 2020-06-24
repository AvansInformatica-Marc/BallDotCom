import { Product } from './Product';
import { EventTypes } from './EventTypes';

interface Event {
    eventType: EventTypes
    eventName: string
    eventDate: Date
}

interface ProductEvent extends Event, Partial<Product> {}

export interface ProductEventStoreObject {
    events: ProductEvent[]
}

export interface ProductEventStoreObjectWithId extends ProductEventStoreObject {
    id: string
}
