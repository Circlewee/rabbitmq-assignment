## Rabbitmq assignment

각 주차별 과제가 브랜치에 작성되어 있습니다.
ex) 1주차 과제 => week-1

### before start

실행 전 `.env`파일을 추가해줘야합니다.

```test
RABBITMQ_ADMIN_ID = your_rabbitmq_admin_id
RABBITMQ_ADMIN_PASSWORD = your_rabbitmq_admin_password
RABBITMQ_PORT = your_rabbitmq_amqp_port
RABBITMQ_VHOST = your_rabbitmq_vhost
```

### start

```bash
# 서버 아키텍쳐 구성
npm run start-config

# message publish 코드 실행
npm run start-sender

# message consume 코드 실행
npm run start-receiver
```
