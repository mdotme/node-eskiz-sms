import { EskizSms } from "../src";
import { config } from "dotenv";
import * as path from "path";
import * as fs from "fs/promises";

const envPath = path.resolve(process.cwd(), ".env.test.local");

config({
  path: envPath,
});

const options = {
  email: process.env.ESKIZSMS_EMAIL as string,
  password: process.env.ESKIZSMS_PASSWORD as string,
};

const sms = new EskizSms({
  ...options,
  envFile: envPath,
});

const testPhone = process.env.ESKIZSMS_TEST_PHONE as string;

describe("EskizSms", () => {
  describe("Init & Auth", () => {
    it("should not have token", () => {
      expect(sms.token).toBeNull();
    });

    it("should have same email", () => {
      expect(sms.options.email).toBe(options.email);
    });

    it("should have same password", () => {
      expect(sms.options.password).toBe(options.password);
    });

    it("should return this", async () => {
      const res = await sms.init();
      expect(res).toBeInstanceOf(EskizSms);
    });

    it("should have token", () => {
      expect(sms.token).not.toBeNull();
    });

    it("process.env[token] should be same as token", () => {
      expect(process.env[sms.options.tokenEnvKey]).toBe(sms.token);
    });

    it("token should be written in env file", async () => {
      const context = await fs.readFile(envPath, "utf-8");
      expect(context).toContain(sms.token);
    });

    it("should return auth user", () => {
      expect(sms.getAuthUser()).resolves.toBeTruthy();
    });
  });

  describe("SMS sending", () => {
    it("should send SMS", () => {
      expect(
        sms.send({
          mobile_phone: testPhone,
          message: "This is test from Eskiz",
        }),
      ).resolves.toBeTruthy();
    });

    // Eskiz 403 rejection. Insufficient documentation.
    // it("should send batch SMS", () => {
    //   expect(
    //     sms.sendBatch({
    //       dispatch_id: 123,
    //       messages: [
    //         {
    //           to: parseInt(testPhone),
    //           text: "eto test",
    //           user_sms_id: randomUUID(),
    //         },
    //         {
    //           to: parseInt(testPhone),
    //           text: "eto test",
    //           user_sms_id: randomUUID(),
    //         },
    //       ],
    //     }),
    //   ).resolves.toBeTruthy();
    // });
  });
});
