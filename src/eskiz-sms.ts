import {
  EskizAuthTokenRes,
  EskizAuthUserRes,
  EskizReportsBalanceRes,
  EskizReportsByCompaniesPayload,
  EskizReportsByCompaniesRes,
  EskizReportsMonthlyRes,
  EskizReportsSmsPayload,
  EskizReportsSmsRes,
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
   * @see https://documenter.getpostman.com/view/663428/RzfmES4z?version=latest#63fbbb29-fd06-4ed4-9bef-0655f7ca502b
   **/
  public getAuthUser(): Promise<AxiosResponse<EskizAuthUserRes>> {
    return this.api<EskizAuthUserRes>("api/auth/user");
  }

  /**
   * Send local (Uzbekistan) SMS
   * @param {EskizSmsSendPayload} payload
   * @returns {Promise<AxiosResponse<EskizSmsSend>>}
   * @see https://documenter.getpostman.com/view/663428/RzfmES4z?version=latest#2fb3b35a-9a44-45da-a312-6cdcc9bcc6c6
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
   * @see https://documenter.getpostman.com/view/663428/RzfmES4z?version=latest#2d87082e-77a5-4614-81ed-22d8e033b4f2
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
   * Send global (international) SMS
   * @param {EskizSmsSendGlobalPayload} payload
   * @see https://documenter.getpostman.com/view/663428/RzfmES4z?version=latest#b83b2d32-f6fc-48db-a205-700598ded36c
   */
  public sendGlobal<T = unknown>(
    payload: EskizSmsSendGlobalPayload,
  ): Promise<AxiosResponse<T>> {
    return this.api.post<T>("api/message/sms/send-global", {
      callback_url: this.options?.callback_url,
      ...payload,
    });
  }

  /**
   * Get account balance
   * @returns {Promise<AxiosResponse<EskizReportsBalanceRes>>}
   * @see https://documenter.getpostman.com/view/663428/RzfmES4z?version=latest#28a1bb52-4e92-4424-901e-a9de21bc6445
   */
  public getBalance(): Promise<AxiosResponse<EskizReportsBalanceRes>> {
    return this.api.get<EskizReportsBalanceRes>("api/user/get-limit");
  }

  /**
   * Get total report of sent sms
   * @param {EskizReportsSmsPayload} payload
   * @returns {Promise<AxiosResponse<EskizReportsSmsRes>>}
   * @see https://documenter.getpostman.com/view/663428/RzfmES4z?version=latest#2ed280d4-3cea-4bc4-b9ce-9c816135ed3d
   */
  public getReportSms(
    payload: EskizReportsSmsPayload,
  ): Promise<AxiosResponse<EskizReportsSmsRes>> {
    if (!("is_global" in payload)) payload.is_global = 0;
    return this.api.post<EskizReportsSmsRes>("/api/user/totals", payload);
  }

  /**
   * Get "monthly" report with specified year for every month for this year. It's called monthly total in Eskiz.
   * @param {number} year
   * @returns {Promise<AxiosResponse<EskizReportsMonthlyRes>>}
   * @see https://documenter.getpostman.com/view/663428/RzfmES4z?version=latest#40c1b650-819e-46ea-bf80-c0be48bea879
   */
  public getReportMonthly(
    year: number,
  ): Promise<AxiosResponse<EskizReportsMonthlyRes>> {
    return this.api.get<EskizReportsMonthlyRes>("api/report/total-by-month", {
      params: { year },
    });
  }

  /**
   * Get report of sent SMS by copmanies.
   * @param {EskizReportsByCompaniesPayload} payload
   * @returns {Promise<AxiosResponse<EskizReportsByCompaniesRes>>}
   * @see https://documenter.getpostman.com/view/663428/RzfmES4z?version=latest#e4d86012-c586-4785-a362-f4d7300b28cd
   */
  public getReportByCompanies(
    payload: EskizReportsByCompaniesPayload,
  ): Promise<AxiosResponse<EskizReportsByCompaniesRes>> {
    return this.api.post<EskizReportsByCompaniesRes>(
      "api/report/total-by-smsc",
      payload,
    );
  }
}
