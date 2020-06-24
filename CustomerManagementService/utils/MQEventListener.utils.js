const amqp = require('amqplib/callback_api');

const {
  customerCreate,
  customerUpdate,
  customerDelete,
} = require('../controllers/customerDenormalizer.controller');

const { MQ_URL } = process.env;
const queue = 'customer';

amqp.connect(MQ_URL, (connectionError, connection) => {
  if (connectionError) throw connectionError;

  // Idempotent: Only creates the channel when it doesn't exist
  connection.createChannel((channelError, channel) => {
    if (channelError) throw channelError;
    console.info('Connected to RabbitMQ');

    channel.assertQueue(queue, { durable: false });

    // Subscribe to the channel
    channel.consume(
      queue,
      (message) => {
        try {
          const { eventType, customer } = JSON.parse(
            message.content.toString()
          );

          switch (eventType) {
            case 'createCustomer':
              customerCreate(customer);
              break;
            case 'updateCustomer':
              customerUpdate(customer);
              break;
            case 'deleteCustomer':
              customerDelete(customer);
              break;
            default:
              console.warning('Event Type Unknown');
              break;
          }
        } catch (notJsonException) {
          console.warning(notJsonException);
        }
      },
      { noAck: true }
    );
  });
});
