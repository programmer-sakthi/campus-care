import type { Message } from "../types";

export const messages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      sender: "user",
      text: "Hi.",
      timestamp: new Date("2026-08-03T10:20:00"),
    },
    {
      id: "2",
      sender: "assistant",
      text: "Hello! How are you feeling today?",
      timestamp: new Date("2026-08-03T10:20:30"),
    },
    {
      id: "3",
      sender: "user",
      text: "I've been stressed about exams.",
      timestamp: new Date("2026-08-03T10:21:00"),
    },
    {
      id: "4",
      sender: "assistant",
      text:
        "That sounds difficult. What part has been weighing on you the most?",
      timestamp: new Date("2026-08-03T10:21:40"),
    },
    {
      id: "5",
      sender: "user",
      text:
        "I'm worried that I'll disappoint everyone if I don't perform well.",
      timestamp: new Date("2026-08-03T10:23:00"),
    },
    {
      id: "6",
      sender: "assistant",
      text:
        "That pressure can feel very heavy. Remember that one exam doesn't define your worth.",
      timestamp: new Date("2026-08-03T10:24:00"),
    },
  ],

  "2": [
    {
      id: "1",
      sender: "user",
      text: "I don't know what to do anymore.",
      timestamp: new Date(),
    },
    {
      id: "2",
      sender: "assistant",
      text:
        "I'm here to listen. Would you like to tell me what happened today?",
      timestamp: new Date(),
    },
  ],

  "3": [
    {
      id: "1",
      sender: "assistant",
      text: "Good morning!",
      timestamp: new Date(),
    },
  ],

  "4": [
    {
      id: "1",
      sender: "user",
      text: "I slept well yesterday.",
      timestamp: new Date(),
    },
    {
      id: "2",
      sender: "assistant",
      text: "That's wonderful! Quality sleep can make a big difference.",
      timestamp: new Date(),
    },
  ],

  "5": [],

  "6": [],
};