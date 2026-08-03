import type { Conversation } from "../types";

export const conversations: Conversation[] = [
  {
    id: "1",
    name: "Sarah",
    lastMessage: "Thank you. That really helped.",
    lastMessageTime: new Date("2026-08-03T10:42:00"),
  },
  {
    id: "2",
    name: "Alex",
    lastMessage: "I'm feeling overwhelmed lately.",
    lastMessageTime: new Date("2026-08-03T09:18:00"),
  },
  {
    id: "3",
    name: "Emma",
    lastMessage: "Can we talk tomorrow?",
    lastMessageTime: new Date("2026-08-03T08:50:00"),
  },
  {
    id: "4",
    name: "Daniel",
    lastMessage: "I finally slept well.",
    lastMessageTime: new Date("2026-08-02T22:15:00"),
  },
  {
    id: "5",
    name: "Olivia",
    lastMessage: "I'm trying meditation.",
    lastMessageTime: new Date("2026-08-02T19:34:00"),
  },
  {
    id: "6",
    name: "Michael",
    lastMessage: "Thanks for checking in.",
    lastMessageTime: new Date("2026-08-02T17:21:00"),
  },
];