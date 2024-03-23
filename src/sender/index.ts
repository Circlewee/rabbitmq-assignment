import amqplib = require('amqplib');
import dotenv = require('dotenv');

dotenv.config();

async function init() {
  const queue = 'tasks';

  console.log('Connect to Rabbitmq server...🚀');
  const connection = await amqplib.connect(
    `amqp://${process.env.RABBITMQ_ADMIN_ID}:${process.env.RABBITMQ_ADMIN_PASSWORD}@localhost:5672`,
  );
  console.log('Connection successful...🚀');

  const senderChannel = await connection.createChannel();

  setInterval(() => {
    const msg = 'Hello World!';
    console.log('Send message: ', msg);
    senderChannel.sendToQueue(queue, Buffer.from(msg));
  }, 1000);
}

init();
