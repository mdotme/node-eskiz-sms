import { UUID } from 'node:crypto';
import { EskizMessageStatus } from './message-status.enum';

interface EskizSmsPayloadCore {
  /**
   * From aka Nickname. Default is from config.
   * @example 4546
   *
   */
  from?: string;

  /**
   * Callback url to receive message info. Default is from config.
   */
  callback_url?: string;
}

export interface EskizSmsSendPayload extends EskizSmsPayloadCore {
  /**
   * Local (Uzbekistan) mobile phone number. Should be string with only numbers.
   * @example 998991234567
   */
  mobile_phone: string;
  message: string;
}

export interface EskizSmsSendRes {
  id: UUID | string;
  message: string;
  status: EskizMessageStatus;
}

export interface EskizSmsBatchMessage {
  user_sms_id: string;
  to: number;
  text: string;
}

export interface EskizSmsSendBatchPayload extends EskizSmsPayloadCore {
  messages: EskizSmsBatchMessage[];
  dispatch_id: number;
}

export interface EskizSmsSendBatchRes {
  id: UUID | string;
  message: string;
  status: EskizMessageStatus[];
}

export interface EskizSmsSendGlobalPayload
  extends Pick<EskizSmsPayloadCore, 'callback_url'> {
  /**
   * International mobile phone number. Should be string with only numbers.
   * @example 1234567891011
   */
  mobile_phone: string;

  /**
   * Country code ISO A-2 format.
   * @example US
   * @see https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes
   */
  country_code: string;

  /**
   * Unicode to send message in cryllic.
   * 1 for enable
   * @example (default) 0
   */
  unicode?: 1 | 0;

  message: string;
}
