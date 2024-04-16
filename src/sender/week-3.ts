import amqplib = require('amqplib');
import dotenv = require('dotenv');
import { Chat } from '../core/Chat';
import { ContentType } from '../constants/ContentType';

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
  const key = { routingKey: 'chat.user.user123', username: 'user123' };
  const chatFactory = new Chat(ContentType.JSON);

  for (let i = 0; i < 10; i++) {
    console.log(`Send to ${key.username}...${i + 1}`);

    const body = Math.floor(Math.random() * 10);
    senderChannel.publish('request', key.routingKey, Buffer.from(chatFactory.composition(body, SENDER_ID)), {
      contentType: chatFactory.contentType,
    });
  }

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

initSender();
