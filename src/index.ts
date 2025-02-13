import { EskizAuthTokenRes, EskizSmsOptions } from "./types";
import { $Fetch, ofetch } from "ofetch";
import { config } from "dotenv";
import { saveToken } from "./utils/save-token";
import * as path from "path";

export class EskizSms {
  public options: Required<EskizSmsOptions>;
  public token: string | null = null;

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
    });
  }

  private setToken(token: string) {
    this.token = token;
    process.env[this.options.tokenEnvKey] = token;
    saveToken(this.token, this.options.envFile, this.options.tokenEnvKey);
  }

  async login() {
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
    if (this.token) return this;

    if (process.env?.[this.options.tokenEnvKey]) {
      this.token = process.env[this.options.tokenEnvKey] as string;
      return this;
    }

    await this.login();
    return this;
  }
}
