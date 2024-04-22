import amqplib = require('amqplib');
import dotenv = require('dotenv');
import readline = require('readline');
import { Chat } from '../core/Chat';
import { ContentType } from '../constants/ContentType';

dotenv.config();

const SENDER_ID = 'usersender';
const SENDER_PASSWORD = 'pass';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
  const chatFactory = new Chat(ContentType.JSON);

  // 5명의 user가 로그인했다고 가정하여 user1 ~ user5 exchange 생성 후 바인딩
  for (let i = 0; i < 5; i++) {
    const exchangeName = `user.user${i + 1}`;
    console.log(`Create ${exchangeName} exchange...🚀`);
    const userExchange = await senderChannel.assertExchange(exchangeName, 'fanout');
    console.log(`Bind ${exchangeName} exchange to room exchange...🚀`);
    await senderChannel.bindExchange(userExchange.exchange, 'user', `*.${exchangeName}`);
  }

  // 입력 부
  console.log('\n명령어를 입력하세요');
  rl.on('line', async function (line) {
    if (!line.startsWith('/')) {
      console.log('적절하지 않은 입력.');
      return;
    }

    const args = line.split(' ');
    const command = args[0].match(/\/(\w+)/)?.[1];
    const roomName = args[1];

    if (!command) {
      console.log('적절하지 않은 입력.');
      return;
    }

    switch (command.toLowerCase()) {
      case 'create': {
        if (!roomName) {
          console.log('방 이름을 입력하세요.');
          break;
        }

        senderChannel.publish(
          'request',
          `command.${command.toLowerCase()}`,
          Buffer.from(chatFactory.composition({ command: command.toLowerCase(), roomName: roomName })),
        );

        break;
      }
      case 'invite': {
        const userId = args[2];

        if (!userId) {
          console.log('초대를 원하는 사용자 id를 입력하세요.');
          break;
        }

        senderChannel.publish(
          'request',
          `command.${command.toLowerCase()}`,
          Buffer.from(chatFactory.composition({ command: command.toLowerCase(), roomName: roomName, userId: userId })),
        );

        break;
      }
      default: {
        break;
      }
    }
  });
}

initSender();
