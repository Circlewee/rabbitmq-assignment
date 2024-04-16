import { ContentType } from '../constants/ContentType';

export class Chat {
  private _contentType: (typeof ContentType)[keyof typeof ContentType];

  constructor(contentType: (typeof ContentType)[keyof typeof ContentType]) {
    this._contentType = contentType;
  }

  composition(body: string | number, userName: string): string {
    if (this._contentType === 'application/json') {
      return JSON.stringify({ body: body, userName: userName });
    }

    return `${userName}: ${body}`;
  }

  decomposition(msg: string) {
    if (this._contentType === 'application/json') {
      return JSON.parse(msg);
    }
  }

  get contentType() {
    return this._contentType;
  }
}
