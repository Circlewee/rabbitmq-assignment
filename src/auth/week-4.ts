import express, { Response } from 'express';
import type { RequestBodyType } from '../types/express';
import type { ResourceRequestBody, TopicRequestBody, UserRequestBody, VHostRequestBody } from '../types/args';

const app = express();
const port = 8080;
const ResponseBody = {
  ALLOW: 'allow',
  DENY: 'deny',
} as const;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 사용자 인증
app.post('/rabbit/auth/user', (req: RequestBodyType<UserRequestBody>, res: Response) => {
  console.log(`postUser ${JSON.stringify(req.body)}\n`);

  const { username, password } = req.body;
  res.status(200);

  if (username && password && username.startsWith('user') && password === 'pass') {
    res.send(`${ResponseBody.ALLOW} administrator`);
  } else {
    res.send(ResponseBody.DENY);
  }
});

// vhost에 접근 권한 인가
app.post('/rabbit/auth/vhost', (req: RequestBodyType<VHostRequestBody>, res: Response) => {
  console.log(`postVhost ${JSON.stringify(req.body)}\n`);

  const { username, vhost } = req.body;
  res.status(200);

  if (username.startsWith('user') && vhost === 'chat') {
    // 'chat' vhost로만 접근 허용
    res.send(ResponseBody.ALLOW);
  } else {
    res.send(ResponseBody.DENY);
  }
});

// 리소스 권한 인가
app.post('/rabbit/auth/resource', (req: RequestBodyType<ResourceRequestBody>, res: Response) => {
  console.log(`postResource ${JSON.stringify(req.body)}\n`);

  const { username, vhost, resource, name, permission } = req.body;

  res.status(200);

  if (username.startsWith('user') && vhost === 'chat') {
    if (resource === 'exchange') {
      if (name === 'user' && permission === 'read') {
        // user.{userId} 큐를 user exchange에 바인딩 할 수 있도록 허가
        res.send(ResponseBody.ALLOW);
      } else if (name.startsWith('user') && ['configure', 'write', 'read'].some((val) => val === permission)) {
        // user.{userId} exchange를 사용할 수 있도록 허가
        res.send(ResponseBody.ALLOW);
      } else if (name === 'request' && ['read', 'write'].some((val) => val === permission)) {
        // request exchange에 publish 할 수 있도록 write만 허가
        res.send(ResponseBody.ALLOW);
      } else if (name === 'amq.default' && ['configure', 'read', 'write'].some((val) => val === permission)) {
        // dead letter exchange를 기본 exchange에 할당?
        res.send(ResponseBody.ALLOW);
      } else if (name === 'command' && ['configure', 'write', 'read'].some((val) => val === permission)) {
        res.send(ResponseBody.ALLOW);
      } else if (name.startsWith('room') && ['configure', 'write', 'read'].some((val) => val === permission)) {
        res.send(ResponseBody.ALLOW);
      } else {
        res.send(ResponseBody.DENY);
      }
    } else if (resource === 'queue') {
      if (name === `user.${username}` && ['configure', 'write', 'read'].some((val) => val === permission)) {
        // configure: user.{userId}로 큐를 생성할 수 있도록 허가
        // write: user.{userId} 큐를 바인딩할 수 있도록 허가
        // read: user.{userId} 큐에서 읽기 허가
        // dlq에도 마찬가지 권한 허용
        res.send(ResponseBody.ALLOW);
      } else if (name.includes('dlq') && ['configure', 'write', 'read'].some((val) => val === permission)) {
        // configure: user.{userId}로 큐를 생성할 수 있도록 허가
        // write: user.{userId} 큐를 바인딩할 수 있도록 허가
        // read: user.{userId} 큐에서 읽기 허가
        // dlq에도 마찬가지 권한 허용
        res.send(ResponseBody.ALLOW);
      } else if (name === 'command' && ['read'].some((val) => val === permission)) {
        res.send(ResponseBody.ALLOW);
      } else {
        res.send(ResponseBody.DENY);
      }
    }
  } else {
    res.send(ResponseBody.DENY);
  }
});

// 바인딩을 설정하거나 메시지를 발행할 때의 권한 인가
app.post('/rabbit/auth/topic', (req: RequestBodyType<TopicRequestBody>, res: Response) => {
  console.log(`postTopic ${JSON.stringify(req.body)}\n`);

  const { username, vhost, resource, name, permission, routing_key: routingKey } = req.body;
  res.status(200);

  const pattern = /\*.user.*/;

  if (username.startsWith('user') && vhost === 'chat' && resource === 'topic') {
    if (name === 'user' && permission === 'read' && (routingKey == null || pattern.test('*.user' + routingKey))) {
      // user.{userId} 큐에서 read 허가
      res.send(ResponseBody.ALLOW);
    } else if (
      (name === 'request' && permission === 'write') ||
      (name === 'request' && routingKey.includes('dlq') && permission === 'read') // dlq에 들어온 메시지를 read
    ) {
      // request exchange에 publish 허가
      res.send(ResponseBody.ALLOW);
    } else {
      res.send(ResponseBody.DENY);
    }
  } else {
    res.send(ResponseBody.DENY);
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
