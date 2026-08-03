export type Sender = "user" | "assistant";

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: Date;
}