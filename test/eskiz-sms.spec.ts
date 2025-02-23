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

  describe("Reports", () => {
    it("should return balance", async () => {
      const res = await sms.getBalance();
      expect(res?.data?.data?.balance).toEqual(expect.any(Number));
    });

    it("should return sms report list", () => {
      const date = new Date();
      expect(
        sms.getReportSms({
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          is_global: 0,
        }),
      ).resolves.toBeTruthy();
    });

    it("should return monthly report list", () => {
      const date = new Date();
      expect(sms.getReportMonthly(date.getFullYear())).resolves.toBeTruthy();
    });

    it("should return report list by companies", () => {
      const date = new Date();
      expect(
        sms.getReportByCompanies({
          year: date.getFullYear(),
          month: date.getMonth() + 1,
        }),
      ).resolves.toBeTruthy();
    });
  });

  describe("Templates", () => {
    it("should fetch SMS templates", async () => {
      const res = await sms.fetchTemplates();
      expect(res).toBeTruthy();
      expect(res.data).toHaveProperty("success", true);
      expect(Array.isArray(res.data.result)).toBe(true);
    }, 10000);
  
    it("each template should have required properties", async () => {
      const res = await sms.fetchTemplates();
      res.data.result.forEach((template) => {
        expect(template).toHaveProperty("id");
        expect(template).toHaveProperty("template");
        expect(template).toHaveProperty("original_text");
        expect(template).toHaveProperty("status");
        expect(["moderation", "inproccess", "service", "reklama", "rejected"]).toContain(template.status);
      });
    }, 10000);
  });
});
