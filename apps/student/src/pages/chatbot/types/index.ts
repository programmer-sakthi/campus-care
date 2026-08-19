export type ChatbotRole = "USER" | "ASSISTANT";
export type RiskLevel = "NONE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface ChatbotMessage {
  id: string;
  role: ChatbotRole;
  content: string;
  riskLevel: RiskLevel;
  createdAt: string;
}

export interface ChatbotChat {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  _count: { messages: number };
}
