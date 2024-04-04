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
  const keys = [
    { routingKey: 'chat.user.user123', username: 'user123' },
    { routingKey: 'chat.user.useruseruser', username: 'useruseruser' },
    { routingKey: 'chat.user.awesomeuser', username: 'awesomeuser' },
    { routingKey: 'chat.user.user_mom', username: 'user_mom' },
  ];

  for (const key of keys) {
    console.log(`Send to ${key.username}...🚀`);
    const msg = `Hello ${key.username}. I'm ${SENDER_ID}.`;

    senderChannel.publish('request', key.routingKey, Buffer.from(msg));
  }

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 500);
}

initSender();
