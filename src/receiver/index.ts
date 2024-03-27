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

  const recieverChannel = await connection.createChannel();
  await recieverChannel.assertQueue(queue);

  recieverChannel.consume(queue, (msg) => {
    if (msg !== null) {
      console.log('Received: ', msg.content.toString());
      recieverChannel.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
  });
}

init();
