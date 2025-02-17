import {
  EskizAuthTokenRes,
  EskizAuthUserRes,
  EskizSmsOptions,
  EskizSmsSendBatchPayload,
  EskizSmsSendBatchRes,
  EskizSmsSendGlobalPayload,
  EskizSmsSendPayload,
  EskizSmsSendRes,
} from "./types";
import { config } from "dotenv";
import { saveToken } from "./utils/save-token";
import * as path from "path";
import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

export class EskizSms {
  public options: Required<Omit<EskizSmsOptions, "callback_url">> &
    Pick<EskizSmsOptions, "callback_url">;
  private _token: string | null = null;
  public get token(): string | null {
    return this._token;
  }

  private api: AxiosInstance;
  private refreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor(options: EskizSmsOptions) {
    this.options = {
      baseUrl: options?.baseUrl || "https://notify.eskiz.uz",
      tokenEnvKey: options?.tokenEnvKey || "ESKIZSMS_ACCESS_TOKEN",
      callback_url: options?.callback_url,
      envFile: options?.envFile || path.join(process.cwd(), ".env"),
      from: options?.from || "4546",
      email: options.email,
      password: options.password,
    };
    config({
      path: this.options.envFile,
    });
    this.api = axios.create({
      baseURL: this.options.baseUrl,
    });
    this.api.interceptors.request.use((config) => {
      if (this._token) {
        config.headers.Authorization = `Bearer ${this._token}`;
      }
      return config;
    });

    this.api.interceptors.response.use(
      (res) => res,
      async (error) => {
        const { response } = error as unknown as {
          config: InternalAxiosRequestConfig;
          response: AxiosResponse;
        };
        if (response.status === 401) {
          if (!this.refreshing) {
            this.refreshing = true;
            try {
              const { data } = await this.login();
              this.setToken(data.token);
              this.refreshSubscribers.forEach((cb) => cb(data.token));
              this.refreshSubscribers = [];
            } catch (err) {
              return Promise.reject(err as Error);
            } finally {
              this.refreshing = false;
            }
          }

          return new Promise((res) => {
            this.refreshSubscribers.push((token) => {
              response.config.headers.Authorization = `Bearer ${token}`;
              res(this.api(response.config));
            });
          });
        }
        return Promise.reject(error as Error);
      },
    );
  }

  private setToken(token: string) {
    this._token = token;
    process.env[this.options.tokenEnvKey] = token;
    saveToken(this._token, this.options.envFile, this.options.tokenEnvKey);
  }

  private async login() {
    const { data } = await this.api.post<EskizAuthTokenRes>("api/auth/login", {
      email: this.options.email,
      password: this.options.password,
    });
    this.setToken(data.data.token);
    return data;
  }

  public async init() {
    if (this._token) return this;

    if (process.env?.[this.options.tokenEnvKey]) {
      this._token = process.env[this.options.tokenEnvKey] as string;
      return this;
    }

    await this.login();
    return this;
  }

  /**
   * Returns current auth user
   * @returns {Promise<AxiosResponse<EskizAuthTokenRes>>}
   **/
  public getAuthUser(): Promise<AxiosResponse<EskizAuthUserRes>> {
    return this.api<EskizAuthUserRes>("api/auth/user");
  }

  /**
   * Send local (Uzbekistan) SMS
   * @param {EskizSmsSendPayload} payload
   * @returns {Promise<AxiosResponse<EskizSmsSend>>}
   */
  public send(
    payload: EskizSmsSendPayload,
  ): Promise<AxiosResponse<EskizSmsSendRes>> {
    return this.api.post<EskizSmsSendRes>("api/message/sms/send", {
      from: this.options.from,
      callback_url: this.options?.callback_url,
      ...payload,
    });
  }

  /**
   * Send batch SMS
   * @param {EskizSmsSendBatchPayload} payload
   * @returns {Promise<AxiosResponse<EskizSmsSendBatchRes>>}
   */
  public sendBatch(
    payload: EskizSmsSendBatchPayload,
  ): Promise<AxiosResponse<EskizSmsSendBatchRes>> {
    return this.api.post<EskizSmsSendBatchRes>("api/message/sms/send-batch", {
      from: this.options.from,
      callback_url: this.options?.callback_url,
      ...payload,
    });
  }

  /**
   * Send batch SMS
   * @param {EskizSmsSendGlobalPayload} payload
   */
  public sendGlobal<T = unknown>(
    payload: EskizSmsSendGlobalPayload,
  ): Promise<AxiosResponse<T>> {
    return this.api.post<T>("api/message/sms/send-global", {
      callback_url: this.options?.callback_url,
      ...payload,
    });
  }
}
