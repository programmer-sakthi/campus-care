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

export type CheckInMood = {
  time: "morning" | "evening" | "night";
  mood: "very_happy" | "happy" | "neutral" | "sad" | "very_sad";
};

export type CheckInAnalysis = {
  score: number;
  category: "Excellent" | "Good" | "Needs Attention";
  insights: string[];
};

export type EmotionalAuditDomainScore = {
  domain: string;
  label: string;
  score: number;
  level: "low" | "moderate" | "high";
};

export type EmotionalAuditAnalysis = {
  summary: string;
  recommendations: string[];
  focus_domains: string[];
};

export async function analyseEmotionalAudit(params: {
  studentId: string;
  domainScores: EmotionalAuditDomainScore[];
  overallScore: number;
  overallCategory: "low" | "moderate" | "high";
}): Promise<EmotionalAuditAnalysis> {
  const res = await fetch(`${ML_SERVICE_URL}/emotional-audit/analyse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      student_id: params.studentId,
      domain_scores: params.domainScores,
      overall_score: params.overallScore,
      overall_category: params.overallCategory,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`ml-service request failed (${res.status}): ${body}`);
  }
  return (await res.json()) as EmotionalAuditAnalysis;
}

export async function analyseDailyCheckIn(params: {
  studentId: string;
  moods: CheckInMood[];
  answers: {
    sleepHours: number | null;
    happyMoment: string;
    stressfulMoment: string;
    waterIntake: "yes" | "no" | null;
    dailyReflection: string;
  };
}): Promise<CheckInAnalysis> {
  const res = await fetch(`${ML_SERVICE_URL}/check-ins/analyse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id: params.studentId, moods: params.moods, answers: params.answers }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`ml-service request failed (${res.status}): ${body}`);
  }
  return (await res.json()) as CheckInAnalysis;
}

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
