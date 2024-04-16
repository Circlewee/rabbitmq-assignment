import amqplib = require('amqplib');
import dotenv = require('dotenv');
import { Chat } from '../core/Chat';
import { ContentType } from '../constants/ContentType';

dotenv.config();

const DLQ_RECEIVER_ID = 'user123';
const DLQ_RECEIVER_PASSWORD = 'pass';

async function initReciever() {
  console.log(
    'Connect to Rabbitmq server...🚀',
    `localhost:${process.env.RABBITMQ_PORT}/${process.env.RABBITMQ_VHOST}`,
  );
  const connection = await amqplib.connect(
    `amqp://${DLQ_RECEIVER_ID}:${DLQ_RECEIVER_PASSWORD}@localhost:${process.env.RABBITMQ_PORT}/${process.env.RABBITMQ_VHOST}`,
  );
  console.log('Connection successful...🚀');

  const dlqReceiverChannel = await connection.createChannel();
  const dlqName = `user.${DLQ_RECEIVER_ID}.dlq`;
  const chatFactory = new Chat(ContentType.JSON);

  console.log('Create dead-letter queue...🚀\n');
  const deadLetterQueue = await dlqReceiverChannel.assertQueue(dlqName, {
    messageTtl: 2000,
    expires: 10000,
    durable: true,
    autoDelete: false,
  });

  await dlqReceiverChannel.bindQueue(deadLetterQueue.queue, 'request', deadLetterQueue.queue);

  console.log(`Receive start...🚀`);
  dlqReceiverChannel.consume(dlqName, async (msg) => {
    if (msg !== null) {
      const msgData = chatFactory.decomposition(msg.content.toString());

      console.log(`${dlqName} queue receive message: ${msgData.body}`);
      dlqReceiverChannel.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
      await connection.close();
      process.exit(0);
    }
  });
}

initReciever();
