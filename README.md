## Rabbitmq assignment

각 주차별 과제가 브랜치에 작성되어 있습니다.
ex) 1주차 과제 => week-1

현재 과제 주차: **week-4**

### before start

실행 전 `.env`파일을 추가해줘야합니다.

```test
RABBITMQ_ADMIN_ID = your_rabbitmq_admin_id
RABBITMQ_ADMIN_PASSWORD = your_rabbitmq_admin_password
RABBITMQ_PORT = your_rabbitmq_amqp_port
RABBITMQ_VHOST = your_rabbitmq_vhost
```

### 설명
#### [auth/week-4.ts](https://github.com/Circlewee/rabbitmq-assignment/blob/week-4/src/auth/week-4.ts)
`user.{userId}` queue 구성을 위한 권한을 추가해주었습니다.

#### [sender/week-4.ts](https://github.com/Circlewee/rabbitmq-assignment/blob/week-4/src/sender/week-4.ts)
**Client**
5명의 user가 로그인 하는 것을 가정해 user.user1 ~ user.user5 exchange를 생성하여 미리 바인딩 해두고 커맨드를 처리합니다.

#### [receiver/week-4.ts](https://github.com/Circlewee/rabbitmq-assignment/blob/week-4/src/receiver/week-4.ts)
**Server**
수신한 명령어 메시지에 따라 `room.{roomName}` exchange를 생성하거나 user queue를 room exchange에 바인딩합니다.

### start

```bash
# 서버 아키텍쳐 구성
npm run start-config

# http auth backend 서버 실행
npm run start-auth

# command 입력 코드 실행 (client)
npm run start-sender

# command 처리 코드 실행 (server)
npm run start-receiver
```
