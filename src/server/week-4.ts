import amqplib = require('amqplib');
import dotenv = require('dotenv');
import { Chat } from '../core/Chat';
import { ContentType } from '../constants/ContentType';

dotenv.config();

async function initReciever() {
  console.log(
    'Connect to Rabbitmq server...🚀',
    `localhost:${process.env.RABBITMQ_PORT}/${process.env.RABBITMQ_VHOST}`,
  );
  const connection = await amqplib.connect(
    `amqp://${process.env.RABBITMQ_ADMIN_ID}:${process.env.RABBITMQ_ADMIN_PASSWORD}@localhost:${process.env.RABBITMQ_PORT}/${process.env.RABBITMQ_VHOST}`,
  );
  console.log('Connection successful...🚀');

  const receiverChannel = await connection.createChannel();
  const chatFactory = new Chat(ContentType.JSON);
  const commandQueueName = 'command';

  console.log(`Receive start from ${commandQueueName} queue...🚀`);
  receiverChannel.consume(commandQueueName, async (msg) => {
    if (msg !== null) {
      const msgData = chatFactory.decomposition(msg.content.toString());
      console.log(msgData);
      const body = msgData.data;

      if (body.command === 'create') {
        const exchangeName = `room.${body.roomName}`;
        console.log(`Create ${exchangeName} exchange...🚀`);
        const roomExchange = await receiverChannel.assertExchange(exchangeName, 'fanout');
        console.log(`Bind ${exchangeName} exchange to room exchange...🚀`);
        await receiverChannel.bindExchange(roomExchange.exchange, 'room', `*.room.${body.roomName}`);

        console.log(`All tasks are complete...🚀`);
        receiverChannel.ack(msg);
      } else if (body.command === 'invite') {
        const userExchangeName = `user.${body.userId}`;
        const roomExchangeName = `room.${body.roomName}`;

        await receiverChannel.bindExchange(userExchangeName, roomExchangeName, '');

        console.log(`Bind complete ${userExchangeName} exchange to ${roomExchangeName} exchange...🚀`);
        receiverChannel.ack(msg);
      }
    } else {
      console.log('Consumer cancelled by server');
      await connection.close();
      process.exit(0);
    }
  });
}

initReciever();
