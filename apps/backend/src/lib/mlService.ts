const ML_SERVICE_URL = process.env.ML_SERVICE_URL ?? "http://localhost:8001";

export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export type ChatResponse = {
  reply: string;
  risk_level: "none" | "low" | "medium" | "high" | "critical";
  memories_used: string[];
};

/**
 * Calls ml-service's /chat/message endpoint. Throws on network or non-2xx
 * responses so the caller's error handling (appErrorToTRPC) takes over.
 */
export async function getChatbotReply(params: {
  studentId: string;
  message: string;
  history: ChatTurn[];
}): Promise<ChatResponse> {
  const res = await fetch(`${ML_SERVICE_URL}/chat/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      student_id: params.studentId,
      message: params.message,
      history: params.history,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`ml-service request failed (${res.status}): ${body}`);
  }

  return (await res.json()) as ChatResponse;
}
