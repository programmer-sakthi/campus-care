import type { Message } from "../types";

export const initialConversations: Record<string, Message[]> = {
  "app-1": [
    {
      id: "m1",
      sender: "student",
      text: "Hi, I applied for counselling. Exams are really overwhelming me right now.",
      time: "2026-08-01T09:12:00",
    },
    {
      id: "m2",
      sender: "counsellor",
      text: "Hi Aisha, thanks for reaching out — that sounds like a lot to carry. Can you tell me a bit more about how it's been affecting your sleep?",
      time: "2026-08-01T09:40:00",
    },
    {
      id: "m3",
      sender: "student",
      text: "I've been waking up around 3am most nights thinking about exams. It's been going on for about 3 weeks.",
      time: "2026-08-01T09:52:00",
    },
    {
      id: "m4",
      sender: "counsellor",
      text: "That makes sense given the pressure you're under. Let's find a time to talk properly — are mornings or evenings easier for you this week?",
      time: "2026-08-01T10:05:00",
    },
    {
      id: "m5",
      sender: "student",
      text: "Evenings work best, after 5pm most days.",
      time: "2026-08-01T10:20:00",
    },
    {
      id: "m6",
      sender: "counsellor",
      text: "I've scheduled us for Saturday, 8 Aug at 11:00 AM — let me know if that doesn't work.",
      time: "2026-08-01T10:22:00",
    },
  ],
  "app-2": [
    {
      id: "m1",
      sender: "student",
      text: "Hi, I've been feeling low and unmotivated for a couple of weeks now.",
      time: "2026-08-04T17:30:00",
    },
    {
      id: "m2",
      sender: "counsellor",
      text: "Thanks for sharing that, Aisha. Has anything changed recently, or has it been building up gradually?",
      time: "2026-08-04T18:10:00",
    },
  ],
};