import amqplib = require('amqplib');
import dotenv = require('dotenv');

dotenv.config();

async function initSender() {
  console.log('Connect to Rabbitmq server...🚀');
  const connection = await amqplib.connect(
    `amqp://${process.env.RABBITMQ_ADMIN_ID}:${process.env.RABBITMQ_ADMIN_PASSWORD}@localhost:${process.env.RABBITMQ_PORT}/${process.env.RABBITMQ_VHOST}`
  );
  console.log('Connection successful...🚀');

  const senderChannel = await connection.createChannel();
  const keys = [
    'command.root',
    'chat.user.test',
    'chat.test.unknown',
    'chat.room.room',
    'room.chat.command',
    'command.room.user',
    'chat.room.user',
  ];
  let index = 0;

  for (const key of keys) {
    console.log(`Send to ${key}...🚀`);
    const msg = `Hello ${key} ${index + 1}`;

    senderChannel.publish('request', key, Buffer.from(msg));
    index++;
  }

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

initSender();
