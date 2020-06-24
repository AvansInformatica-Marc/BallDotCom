import { Json } from './Json';

export type MqMessageSender = (queueName: string, data: Json) => void;
