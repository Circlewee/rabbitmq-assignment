import amqplib = require('amqplib');
import dotenv = require('dotenv');

dotenv.config();

async function initReciever() {
  console.log('Connect to Rabbitmq server...🚀');
  const connection = await amqplib.connect(
    `amqp://${process.env.RABBITMQ_ADMIN_ID}:${process.env.RABBITMQ_ADMIN_PASSWORD}@localhost:${process.env.RABBITMQ_PORT}/${process.env.RABBITMQ_VHOST}`
  );
  console.log('Connection successful...🚀');

  const queues = ['command', 'user', 'room'];
  const receiverChannel = await connection.createChannel();

  console.log(`Receive start...🚀`);
  for (const queue of queues) {
    receiverChannel.consume(queue, (msg) => {
      if (msg !== null) {
        console.log(`${queue.toUpperCase()} queue receive message: ${msg.content.toString()}`);
        receiverChannel.ack(msg);
      } else {
        console.log('Consumer cancelled by server');
      }
    });
  }
}

initReciever();
