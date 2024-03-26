import amqplib = require('amqplib');
import dotenv = require('dotenv');

dotenv.config();

async function init() {
  console.log('Connect to Rabbitmq server...🚀');
  const connection = await amqplib.connect(
    `amqp://${process.env.RABBITMQ_ADMIN_ID}:${process.env.RABBITMQ_ADMIN_PASSWORD}@localhost:5672`,
  );
  console.log('Connection successful...🚀');

  const keys = [
    'command.root.test',
    'chat.user.test',
    'chat.test.unknown',
    'chat.room.room',
    'room.chat.command',
    'command.room.user',
    'chat.room.user',
  ];

  const recieverChannel = await connection.createChannel();

  for (const key of keys) {
    recieverChannel.consume(key, (msg) => {
      if (msg !== null) {
        console.log('Received: ', msg.content.toString());
        recieverChannel.ack(msg);
      } else {
        console.log('Consumer cancelled by server');
      }
    });
  }
}

init();
