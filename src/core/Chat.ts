import { ContentType } from '../constants/ContentType';

export class Chat {
  private _contentType: (typeof ContentType)[keyof typeof ContentType];

  constructor(contentType: (typeof ContentType)[keyof typeof ContentType]) {
    this._contentType = contentType;
  }

  composition(data: { [key: string]: any }): any {
    if (this._contentType === 'application/json') {
      return JSON.stringify({ data: data });
    }

    return data;
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
