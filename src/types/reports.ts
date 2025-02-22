import { EskizMessageStatus } from "./message-status.enum";

export interface EskizReportsBalanceRes {
  data: {
    balance: number;
  };
  status: "success" | string;
}

export interface EskizReportsSmsPayload {
  year: number;

  /**
   * Starts with 1 (January)
   * Max value is 12 (December)
   */
  month: number;

  /**
   * For filtering global aka international
   * @example (default) 0
   */
  is_global?: 1 | 0;
}

export interface EskizReportsSmsItem {
  status: EskizMessageStatus;
  month:
    | "Jan"
    | "Feb"
    | "Mar"
    | "Apr"
    | "May"
    | "Jun"
    | "Jul"
    | "Aug"
    | "Sep"
    | "Oct"
    | "Nov"
    | "Dec"
    | string;
  packets: number;
}

export interface EskizReportsSmsRes {
  status: "success" | string;
  data: EskizReportsSmsItem[];
  id: null | number;
}

// Monthly report
export interface EskizReportsMonthlyItem {
  year: number;

  /**
   * Starts with 1 (January)
   * Max value is 12 (December)
   */
  month: number;

  /**
   * Count of ad type SMS
   */
  ad_parts: number;

  /**
   * Expenses of ad type SMS
   */
  ad_spent: number;

  /**
   * Count of service type SMS
   */
  parts: number;

  /**
   * Expenses of service type SMS
   */
  spent: number;

  /**
   * It's highly total count of sent SMS
   */
  total_parts: number;

  /**
   * It's highly sum of all sent SMS
   */
  total_spent: number;
}

export interface EskizReportsMonthlyRes {
  data: EskizReportsMonthlyItem[];
}
