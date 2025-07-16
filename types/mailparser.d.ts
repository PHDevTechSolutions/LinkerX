declare module 'mailparser' {
  import { Readable } from 'stream';

  export interface Address {
    name?: string;
    address: string;
  }

  export interface AddressObject {
    value: Address[];
    html?: string;
    text?: string;
  }

  export interface ParsedMail {
    subject?: string;
    date?: Date;
    text?: string;
    html?: string;
    from?: AddressObject;
    to?: AddressObject;
    cc?: AddressObject;
    bcc?: AddressObject;
    headers: Map<string, string>;
    attachments?: any[];
  }

  export function simpleParser(source: Buffer | string | Readable): Promise<ParsedMail>;
}
