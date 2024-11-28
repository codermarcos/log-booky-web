import type { ICognitoStorage } from 'amazon-cognito-identity-js';

function decode(value: string) {

  let result = value;

  if (result[0] === '"') result = result.slice(
    1,
    -1
  );


  return result.replace(
    /(%[\dA-F]{2})+/gi,
    decodeURIComponent
  );

}

function encode(value: string) {

  return encodeURIComponent(value).replace(
    /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
    decodeURIComponent
  );

}

export default class CookieStorage implements ICognitoStorage {

  public path = '/';

  public secure = true;

  public expires = 30;

  public sameSite = 'Lax';

  public domain = process.env.APP_DOMAIN as string;

  private entries: Array<string> = [];

  constructor(cookies?: string) {

    this.load(cookies);

  }

  private load(cookies?: string) {

    this.entries = typeof cookies === 'string'
      ? cookies.split('; ')
      : [];

  }

  private set(key: string, value: string, expires: number = this.expires) {

    const name = encode(key);

    const params = [
      `${name}=${encode(value)}`,
      `SameSite=${this.sameSite}`,
      `Expires=${new Date(Date.now() + (expires * 60 * 1000)).toUTCString()}`,
      `Path=${this.path}`,
    ];

    if (this.secure) params.push('Secure');


    const cookies = params.join(';');

    if (typeof document !== 'undefined' && 'cookie' in document) document.cookie = cookies;

    else this.entries.push(cookies);


  }

  // eslint-disable-next-line max-statements, max-len
  private get<T extends string | undefined = undefined>(key?: T): T extends string ? string : Record<string, string> {

    const entries = typeof document !== 'undefined' && 'cookie' in document
      ? document.cookie.split('; ')
      : this.entries;

    const cookies: Record<string, string> = {};

    for (let index = 0; index < entries.length; index += 1) {

      if (entries[index].length === 0) continue;

      const [
        name,
        value,
      ] = entries[index].split('=');

      const found = decode(name);
      cookies[found] = decode(value);

      if (key === found) break;
      
    }

    return (
      typeof key === 'string'
        ? cookies[key]
        : cookies
    ) as T extends string ? string : Record<string, string>;

  }

  setItem(key: string, value: string) {

    this.set(
      key,
      value,
    );

    return this.getItem(key);

  }

  getItem(key: string): string {

    return this.get(key);

  }

  removeItem(key: string) {

    return this.set(
      key,
      '',
      -1,
    );

  }

  clear() {

    const cookies = this.get();
    const keys = Object.keys(cookies);
    for (let index = 0; index < keys.length; index += 1)
      this.removeItem(keys[index]);

    return {};

  }

}
