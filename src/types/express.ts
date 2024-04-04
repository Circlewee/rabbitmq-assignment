import { Request } from 'express';

export type DefaultRequest = Request<{}, {}, {}, {}>;

export type RequestBodyType<ReqBody> = Request<{}, {}, ReqBody>;
