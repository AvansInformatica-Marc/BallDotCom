import { required, Types } from '@peregrine/mongo-connect';

export const supplierSchema = { name: required(String) };

export const productSchema = {
  name: required(String),
  supplier: required(Types.ID),
  price: required(Number),
  stock: required(Number),
};

export const productEventStoreSchema = {
  events: [
    {
      eventType: required(String),
      eventName: required(String),
      eventDate: required(Date),
      ...productSchema,
    },
  ],
};
