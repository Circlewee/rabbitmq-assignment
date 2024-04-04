import amqplib = require('amqplib');
import dotenv = require('dotenv');

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

  console.log(`Create ${queueName} queue...🚀`);
  const userQueue = await receiverChannel.assertQueue(queueName, { autoDelete: true });
  console.log(`Bind ${queueName} queue...🚀`);
  await receiverChannel.bindQueue(userQueue.queue, 'user', `*.${queueName}`);

  console.log(`Receive start...🚀`);
  receiverChannel.consume(queueName, async (msg) => {
    if (msg !== null) {
      console.log(`${queueName} queue receive message: ${msg.content.toString()}`);
      receiverChannel.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
      await connection.close();
      process.exit(0);
    }
  });
}

initReciever();
