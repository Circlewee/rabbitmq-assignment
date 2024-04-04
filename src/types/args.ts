export type UserRequestBody = {
  username: string;
  password: string;
};

export type VHostRequestBody = { username: string; vhost: string; ip: string };

export type ResourceRequestBody = {
  username: string;
  vhost: string;
  resource: 'exchange' | 'queue' | 'topic';
  name: string;
  permission: 'configure' | 'write' | 'read';
};

export type TopicRequestBody = {
  username: string;
  vhost: string;
  resource: 'exchange' | 'queue' | 'topic';
  name: string;
  permission: 'configure' | 'write' | 'read';
  routing_key: string;
};
