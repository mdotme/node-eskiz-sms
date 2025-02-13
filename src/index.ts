import { EskizAuthTokenRes, EskizAuthUserRes, EskizSmsOptions } from "./types";
import { $Fetch, ofetch } from "ofetch";
import { config } from "dotenv";
import { saveToken } from "./utils/save-token";
import * as path from "path";

export class EskizSms {
  public options: Required<EskizSmsOptions>;
  private _token: string | null = null;
  public get token(): string | null {
    return this._token;
  }

  private api: $Fetch;
  private refreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor(options: EskizSmsOptions) {
    this.options = {
      baseUrl: options?.baseUrl || "https://notify.eskiz.uz",
      tokenEnvKey: options?.tokenEnvKey || "ESKIZSMS_ACCESS_TOKEN",
      envFile: options?.envFile || path.join(process.cwd(), ".env"),
      email: options.email,
      password: options.password,
    };
    config({
      path: this.options.envFile,
    });
    this.api = ofetch.create({
      baseURL: this.options.baseUrl,

      onRequest: ({ options }) => {
        if (this._token) {
          options.headers.append("Authorization", `Bearer ${this._token}`);
        }
      },
    });
  }

  private setToken(token: string) {
    this._token = token;
    process.env[this.options.tokenEnvKey] = token;
    saveToken(this._token, this.options.envFile, this.options.tokenEnvKey);
  }

  private async login() {
    const res = await this.api<EskizAuthTokenRes>("api/auth/login", {
      method: "POST",
      body: {
        email: this.options.email,
        password: this.options.password,
      },
    });
    this.setToken(res.data.token);
    return res;
  }

  async init() {
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
   * @returns Promise<EskizAuthTokenRes>
   **/
  public getAuthUser() {
    return this.api<EskizAuthUserRes>("api/auth/user");
  }
}
