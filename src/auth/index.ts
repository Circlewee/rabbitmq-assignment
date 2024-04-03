import express, { Request, Response } from 'express';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 사용자 인증
app.post('/rabbit/auth/user', (req: Request<{}, {}, { username?: string; password?: string }>, res: Response) => {
  console.log(`postUser ${JSON.stringify(req.body)}\n`);

  const { username, password } = req.body;
  res.status(200);

  if (username && password && username.startsWith('user') && password === 'pass') {
    res.send('allow administrator');
  } else {
    res.send('deny');
  }
});

// vhost에 접근 권한 인가
app.post(
  '/rabbit/auth/vhost',
  (req: Request<{}, {}, { username: string; vhost: string; ip: string }>, res: Response) => {
    console.log(`postVhost ${JSON.stringify(req.body)}\n`);

    const { username, vhost } = req.body;
    res.status(200);

    if (username.startsWith('user') && vhost === 'chat') {
      res.send('allow');
    } else {
      res.send('deny');
    }
  },
);

// 리소스 권한 인가
app.post(
  '/rabbit/auth/resource',
  (
    req: Request<
      {},
      {},
      {
        username: string;
        vhost: string;
        resource: 'exchange' | 'queue' | 'topic';
        name: string;
        permission: 'configure' | 'write' | 'read';
      }
    >,
    res: Response,
  ) => {
    console.log(`postResource ${JSON.stringify(req.body)}\n`);

    const { username, vhost, resource, name, permission } = req.body;
    res.status(200);

    if (username.startsWith('user') && vhost === 'chat') {
      if (
        resource === 'exchange' &&
        name === 'user' &&
        ['configure', 'write', 'read'].some((val) => val === permission)
      ) {
        res.send('allow');
      } else if (
        resource === 'queue' &&
        name === `user.${username}` &&
        ['configure', 'write', 'read'].some((val) => val === permission)
      ) {
        res.send('allow');
      }
    } else {
      res.send('deny');
    }
  },
);

// 바인딩을 설정하거나 메시지를 발행할 때의 권한 인가
app.post(
  '/rabbit/auth/topic',
  (
    req: Request<
      {},
      {},
      {
        username: string;
        vhost: string;
        resource: 'exchange' | 'queue' | 'topic';
        name: string;
        permission: 'configure' | 'write' | 'read';
        routing_key: string;
      }
    >,
    res: Response,
  ) => {
    console.log(`postTopic ${JSON.stringify(req.body)}\n`);

    const { username, vhost, resource, name, permission, routing_key: routingKey } = req.body;
    res.status(200);

    const pattern = /\*.user.*/;

    if (
      username.startsWith('user') &&
      vhost === 'chat' &&
      resource === 'topic' &&
      name === 'user' &&
      permission === 'read' &&
      (routingKey == null || pattern.test('*.user' + routingKey))
    ) {
      res.send('allow');
    } else {
      res.send('deny');
    }
  },
);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
