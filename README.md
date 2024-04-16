## Rabbitmq assignment

각 주차별 과제가 브랜치에 작성되어 있습니다.
ex) 1주차 과제 => week-1

현재 과제 주차: **week-3**

### before start

실행 전 `.env`파일을 추가해줘야합니다.

```test
RABBITMQ_ADMIN_ID = your_rabbitmq_admin_id
RABBITMQ_ADMIN_PASSWORD = your_rabbitmq_admin_password
RABBITMQ_PORT = your_rabbitmq_amqp_port
RABBITMQ_VHOST = your_rabbitmq_vhost
```

### 설명
#### [auth/week-3.ts](https://github.com/Circlewee/rabbitmq-assignment/blob/week-3/src/auth/week-3.ts)
dead letter queue 구성을 위한 권한을 추가해주었습니다.

#### [sender/week-3.ts](https://github.com/Circlewee/rabbitmq-assignment/blob/week-3/src/sender/week-3.ts)
`Math.random() * 10`으로 0 - 9 사이의 난수를 생성하여 총 10번 publish합니다.

#### [receiver/week-3.ts](https://github.com/Circlewee/rabbitmq-assignment/blob/week-3/src/receiver/week-3.ts)
앞서 consume하는 코드는 동일하나 난수가 5미만이라면 nack 처리하여 dead letter queue로 메시지를 보냅니다.

#### [receiver/week-3-dead.ts](https://github.com/Circlewee/rabbitmq-assignment/blob/week-3/src/receiver/week-3-dead.ts)
nack처리 되어 dead letter queue로 온 message를 consume합니다.


### start

```bash
# 서버 아키텍쳐 구성
npm run start-config

# http auth backend 서버 실행
npm run start-auth

# message publish 코드 실행
npm run start-sender

# message consume 코드 실행
npm run start-receiver

# dead letter queue에 쌓인 메시지를 consume
npm run start-dead-letter-receiver
```
