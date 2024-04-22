import amqplib = require('amqplib');
import dotenv = require('dotenv');

dotenv.config();

export async function setServerConfig(): Promise<void> {
  console.log('Connect to Rabbitmq server...🚀');
  const connection = await amqplib.connect(
    `amqp://${process.env.RABBITMQ_ADMIN_ID}:${process.env.RABBITMQ_ADMIN_PASSWORD}@localhost:${process.env.RABBITMQ_PORT}/${process.env.RABBITMQ_VHOST}`,
  );
  console.log('Connection successful...🚀\n');

  console.log('Assert request exchange...🚀\n');
  const requestExchangeKey = 'request';
  const channel = await connection.createChannel();
  await channel.assertExchange(requestExchangeKey, 'topic');

  console.log('Assert command queue...🚀\n');
  const commandQueue = await channel.assertQueue('command');
  const commandQueueBindPattern = 'command.#';
  await channel.bindQueue(commandQueue.queue, requestExchangeKey, commandQueueBindPattern);

  console.log('Assert chat exchange...🚀\n');
  const chatExchangeKey = 'chat';
  const chatExchangeBindPattern = 'chat.#';
  const chatExchange = await channel.assertExchange(chatExchangeKey, 'topic');
  await channel.bindExchange(chatExchange.exchange, requestExchangeKey, chatExchangeBindPattern);

  console.log('Assert user exchange...🚀\n');
  const userExchangeKey = 'user';
  const userExchangeBindPattern = '*.user.#';
  const userExchange = await channel.assertExchange(userExchangeKey, 'topic');
  await channel.bindExchange(userExchange.exchange, chatExchange.exchange, userExchangeBindPattern);

  console.log('Assert room exchange...🚀\n');
  const roomExchangeKey = 'room';
  const roomExchangeBindPattern = '*.room.#';
  const roomExchange = await channel.assertExchange(roomExchangeKey, 'fanout');
  await channel.bindExchange(roomExchange.exchange, chatExchange.exchange, roomExchangeBindPattern);

  // console.log('Assert room queue...🚀\n');cke
  // const roomQueue = await channel.assertQueue(roomExchangeKey, { autoDelete: true });
  // await channel.bindQueue(roomQueue.queue, roomExchange.exchange, '');

  console.log('All assertions are complete...🚀\n');
  await channel.close();
  await connection.close();
  process.exit(0);
}

setServerConfig();
