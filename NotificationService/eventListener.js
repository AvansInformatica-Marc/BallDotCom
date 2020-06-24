const amqp = require('amqplib/callback_api');
const { notificationReceived } = require('./eventHandler');

const { MQ_URL } = process.env;
const queue = 'notification';

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
          notificationReceived(JSON.parse(message.content.toString()));
        } catch (notJsonException) {
          console.warning(notJsonException);
        }
      },
      { noAck: true }
    );
  });
});
