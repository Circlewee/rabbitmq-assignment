import amqplib = require('amqplib');
import dotenv = require('dotenv');

dotenv.config();

async function init() {
  console.log('Connect to Rabbitmq server...🚀');
  const connection = await amqplib.connect(
    `amqp://${process.env.RABBITMQ_ADMIN_ID}:${process.env.RABBITMQ_ADMIN_PASSWORD}@localhost:5672`,
  );
  console.log('Connection successful...🚀');

  const senderChannel = await connection.createChannel();

  const keys = [
    'command.root.test',
    'chat.user.test',
    'chat.test.unknown',
    'chat.room.room',
    'room.chat.command',
    'command.room.user',
    'chat.room.user',
  ];

  const rootExchangeKey = 'request';

  for (const key of keys) {
    console.log('Send to ', key);
    const msg = `Message to: ${key}`;

    senderChannel.publish(rootExchangeKey, key, Buffer.from(msg));
  }

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

init();
