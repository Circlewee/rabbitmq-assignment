import amqplib = require('amqplib');
import dotenv = require('dotenv');
import { Chat } from '../core/Chat';
import { ContentType } from '../constants/ContentType';

dotenv.config();

const RECEIVER_ID = 'user123';
const RECEIVER_PASSWORD = 'pass';

async function initReciever() {
  console.log(
    'Connect to Rabbitmq server...🚀',
    `localhost:${process.env.RABBITMQ_PORT}/${process.env.RABBITMQ_VHOST}`,
  );
  const connection = await amqplib.connect(
    `amqp://${RECEIVER_ID}:${RECEIVER_PASSWORD}@localhost:${process.env.RABBITMQ_PORT}/${process.env.RABBITMQ_VHOST}`,
  );
  console.log('Connection successful...🚀');

  const receiverChannel = await connection.createChannel();
  const queueName = `user.${RECEIVER_ID}`;
  const chatFactory = new Chat(ContentType.JSON);

  console.log(`Create ${queueName} queue...🚀`);
  const userQueue = await receiverChannel.assertQueue(queueName, {
    autoDelete: true,
    deadLetterExchange: '',
    deadLetterRoutingKey: `${queueName}.dlq`,
  });
  console.log(`Bind ${queueName} queue...🚀`);
  await receiverChannel.bindQueue(userQueue.queue, 'user', `*.${queueName}`);

  console.log(`Receive start...🚀`);
  receiverChannel.consume(queueName, async (msg) => {
    if (msg !== null) {
      const msgData = chatFactory.decomposition(msg.content.toString());
      const body = Number(msgData.body);

      console.log(`${queueName} queue receive message: ${body}`);

      if (body >= 5) {
        console.log('Message acked');
        receiverChannel.ack(msg, false);
      } else {
        console.log('Message nacked');
        receiverChannel.nack(msg, false, false);
      }
    } else {
      console.log('Consumer cancelled by server');
      await connection.close();
      process.exit(0);
    }
  });
}

initReciever();
