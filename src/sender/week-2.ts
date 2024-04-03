import amqplib = require('amqplib');
import dotenv = require('dotenv');

dotenv.config();

const SENDER_ID = 'usersender';
const SENDER_PASSWORD = 'pass';

async function initSender() {
  console.log(
    'Connect to Rabbitmq server...🚀',
    `localhost:${process.env.RABBITMQ_PORT}/${process.env.RABBITMQ_VHOST}`,
  );
  const connection = await amqplib.connect(
    `amqp://${SENDER_ID}:${SENDER_PASSWORD}@localhost:${process.env.RABBITMQ_PORT}/${process.env.RABBITMQ_VHOST}`,
  );
  console.log('Connection successful...🚀');

  const senderChannel = await connection.createChannel();
  const keys = ['chat.user.user', 'chat.user.user123', 'chat.user.123', 'chat.user.admin'];
  const keys2 = ['chat.user.user123'];
  let index = 0;

  for (const key of keys2) {
    console.log(`Send to ${key}...🚀`);
    const msg = `Hello ${key} ${index + 1}. I'm ${SENDER_ID}`;

    senderChannel.publish('request', key, Buffer.from(msg));
    index++;
  }

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

initSender();
