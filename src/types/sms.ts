import { UUID } from "node:crypto";
import { EskizMessageStatus } from "./message-status.enum";

export interface EskizSmsSendPayload {
  /**
   * Local (Uzbekistan) mobile phone number. Should be string with only numbers.
   * @example 998991234567
   */
  mobile_phone: string;

  /**
   * From aka Nickname. Default is from config.
   * @example 4546
   *
   */
  from?: string;

  message: string;
  callback_url?: string;
}

export interface EskizSmsSendRes {
  id: UUID | string;
  message: string;
  status: EskizMessageStatus;
}
