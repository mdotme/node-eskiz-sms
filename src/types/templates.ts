export interface EskizSmsTemplate {
    id: number;
    template: string;
    original_text: string;
    status: "moderation" | "inproccess" | "service" | "reklama" | "rejected";
}
  
export interface EskizSmsTemplateListRes {
    success: boolean;
    result: EskizSmsTemplate[];
}