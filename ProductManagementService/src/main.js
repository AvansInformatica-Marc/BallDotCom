/**
 * @typedef { import('net').Server } Server
 */

import { MongoDB } from '@peregrine/mongo-connect';
import { MqService } from '@peregrine/mq-lib';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import swagger from 'swagger-injector';

import './utils/swagger';

import EventStoreRepository from './data-storage/EventStoreRepository';
import QueryRepository from './data-storage/QueryRepository';
import createApiRouter from './router/apiRouter';
import promisify from './utils/promisify';
import MqEventListener from './MqEventListener';

/**
 * @param { MqService } rabbitMqService
 * @param { Server } server
 * @returns { Promise<void> }
 */
export async function exit(rabbitMqService, server) {
  console.log('Shutting down...');

  await Promise.all([
    rabbitMqService.close(),
    promisify((cb) => server.close(cb)),
  ]);

  console.log('Bye');
}

/**
 * @returns { Promise<void> }
 */
export async function main() {
  const [db, rabbitMqService] = await Promise.all([
    MongoDB.connect(process.env.MONGO_URL ?? 'mongodb://localhost:27017'),
    MqService.connect(process.env.MQ_URL ?? 'amqp://localhost:5672'),
  ]);

  const queryRepository = new QueryRepository(db);
  const eventStoreRepository = new EventStoreRepository(db);

  const mqEventListener = new MqEventListener(queryRepository);
  rabbitMqService.addListener('product', (/** @type {string} */ data) =>
    mqEventListener.onProductMessageReceived(data)
  );
  rabbitMqService.addListener('supplier', (/** @type {string} */ data) =>
    mqEventListener.onSupplierMessageReceived(data)
  );

  const koaApp = new Koa();
  koaApp.use(bodyParser());

  const apiRouter = createApiRouter(
    queryRepository,
    eventStoreRepository,
    rabbitMqService
  );

  koaApp.use(apiRouter.routes()).use(apiRouter.allowedMethods());

  koaApp.use(swagger.koa({ path: './docs/swagger.json' }));

  // Remove default response body, catch all errors.
  koaApp.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      console.error(err);
      ctx.response.status = 500;
    }

    const statusCode = ctx.response.status ?? 404;
    ctx.response.body = ctx.response.body ?? '';
    ctx.response.status = statusCode;
  });

  const port = process.env.PORT ?? 8080;

  const server = await promisify((cb) => koaApp.listen(port, cb));

  console.log('Service is running');

  process.on('exit', () => exit(rabbitMqService, server));
}

main().catch((err) => {
  console.error(err);
  throw err;
});
