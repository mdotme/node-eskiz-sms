import { EskizSms } from "../src";
import { config } from "dotenv";
import * as path from "path";

const envPath = path.resolve(process.cwd(), ".env.test.local");

config({
  path: envPath,
});

const sms = new EskizSms({
  email: process.env.ESKIZSMS_EMAIL as string,
  password: process.env.ESKIZSMS_PASSWORD as string,
  envFile: envPath,
});

describe("EskizSms", () => {
  describe("Init & Auth", () => {
    it("should not have token", () => {
      expect(sms.token).toBeNull();
    });

    it("should return this", async () => {
      const res = await sms.init();
      expect(res).toBeInstanceOf(EskizSms);
    });

    it("should have token", () => {
      expect(sms.token).not.toBeNull();
    });
  });
});
