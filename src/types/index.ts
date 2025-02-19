export * from "./auth";
export * from "./sms";
export * from "./message-status.enum";
export * from "./reports";

/**
 * Options for configuring the EskizSms class.
 */
export interface EskizSmsOptions {
  /**
   * Base URL of Eskiz gateway.
   * @example (default) https://notify.eskiz.uz
   */
  baseUrl?: string;

  email: string;

  /**
   * Secret key for api requests.
   * @see https://my.eskiz.uz/sms/settings
   */
  password: string;

  /**
   * From aka Nickname.
   * @example (default) 4546
   *
   */
  from?: string;

  /**
   * Callback url to receive message info.
   */
  callback_url?: string;

  /**
   * Env Key for saving token on env file until expiration.
   * @example (default) ESKIZSMS_ACCESS_TOKEN
   */
  tokenEnvKey?: string;

  /**
   * Path to env file to save new token.
   * @example (default) .env
   */
  envFile?: string;
}
