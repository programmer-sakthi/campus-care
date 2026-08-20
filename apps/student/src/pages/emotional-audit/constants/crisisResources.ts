// constants/crisisResources.ts
//
// Deliberately static, never AI-generated. When a student flags a Section G
// safety question, we show this immediately and independently of any
// backend/ml-service round trip — see hooks/useEmotionalAudit.ts.

export interface CrisisResource {
  name: string;
  description: string;
  contact: string;
  href: string;
}

export const CRISIS_RESOURCES: CrisisResource[] = [
  {
    name: "Tele-MANAS",
    description: "Government of India 24/7 free, confidential mental health helpline, in English and 20+ regional languages.",
    contact: "Call 14416 or 1-800-891-4416",
    href: "tel:14416",
  },
  {
    name: "Emergency services",
    description: "If you or someone else is in immediate physical danger, contact emergency services right away.",
    contact: "Call 112",
    href: "tel:112",
  },
];
