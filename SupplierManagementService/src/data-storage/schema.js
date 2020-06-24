import { required } from '@peregrine/mongo-connect';

export const supplierSchema = { name: required(String) };

export const supplierEventStoreSchema = {
  events: [
    {
      eventType: required(String),
      eventName: required(String),
      eventDate: required(Date),
      ...supplierSchema,
    },
  ],
};
