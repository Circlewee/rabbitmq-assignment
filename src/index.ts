import amqplib = require('amqplib');
import dotenv = require('dotenv');

dotenv.config();

async function init() {
  const queue = 'tasks';
  const connection = await amqplib.connect(
    `amqp://${process.env.RABBITMQ_ADMIN_ID}:${process.env.RABBITMQ_ADMIN_PASSWORD}@localhost:5672`,
  );

  const ch1 = await connection.createChannel();
  await ch1.assertQueue(queue);

  ch1.consume(queue, (msg) => {
    if (msg !== null) {
      console.log('Received: ', msg.content.toString());
      ch1.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
  });

  const ch2 = await connection.createChannel();

  setInterval(() => {
    ch2.sendToQueue(queue, Buffer.from('test message!!'));
  }, 1000);
}

init();
