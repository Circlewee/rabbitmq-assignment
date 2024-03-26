import amqplib = require('amqplib');
import dotenv = require('dotenv');

dotenv.config();

async function init() {
  console.log('Connect to Rabbitmq server...🚀');
  const connection = await amqplib.connect(
    `amqp://${process.env.RABBITMQ_ADMIN_ID}:${process.env.RABBITMQ_ADMIN_PASSWORD}@localhost:5672`,
  );
  console.log('Connection successful...🚀');

  const requestExchangeKey = 'request';
  const channel = await connection.createChannel();
  await channel.assertExchange(requestExchangeKey, 'topic');

  const commandQueue = await channel.assertQueue('command');
  const commandQueueBindPattern = 'command.*';
  await channel.bindQueue(commandQueue.queue, requestExchangeKey, commandQueueBindPattern);

  const chatExchangeKey = 'chat';
  const chatExchangeBindPattern = 'chat.#';
  const chatExchange = await channel.assertExchange(chatExchangeKey, 'topic');
  await channel.bindExchange(chatExchange.exchange, requestExchangeKey, chatExchangeBindPattern);

  const userExchangeKey = 'user';
  const userExchangeBindPattern = '*.user.#';
  const userExchange = await channel.assertExchange(userExchangeKey, 'topic');
  await channel.bindExchange(userExchange.exchange, chatExchange.exchange, userExchangeBindPattern);

  const userQueue = await channel.assertQueue(userExchangeKey);
  await channel.bindQueue(userQueue.queue, userExchange.exchange, '');

  const roomExchangeKey = 'room';
  const roomExchangeBindPattern = '*.room.#';
  const roomExchange = await channel.assertExchange(roomExchangeKey, 'topic');
  await channel.bindExchange(roomExchange.exchange, chatExchange.exchange, roomExchangeBindPattern);

  const roomQueue = await channel.assertQueue(roomExchangeKey);
  await channel.bindQueue(roomQueue.queue, roomExchange.exchange, '');
}

init();
