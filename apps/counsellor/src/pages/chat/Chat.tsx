import { useState } from "react";
import { ConversationList } from "./components/ConversationList";
import { ChatWindow } from "./components/ChatWindow";
import { ChatInput } from "./components/ChatInput";
import { conversations as mockConversations } from "./mocks/conversation";
import { messages as mockMessages } from "./mocks/messages";
import type { Conversation } from "./types";
import type { Message } from "./types";

export default function Chat() {
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(mockConversations[0]?.id ?? null);
  const [conversations, setConversations] = useState<Conversation[]>(
    mockConversations,
  );
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>(
    mockMessages,
  );
  const [inputValue, setInputValue] = useState("");

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId,
  );
  const activeMessages = allMessages[activeConversationId ?? ""] ?? [];

  const handleSend = () => {
    if (!inputValue.trim() || !activeConversationId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue.trim(),
      timestamp: new Date(),
    };

    setAllMessages((prev) => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] ?? []), newMessage],
    }));

    setInputValue("");

    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: "Thanks for sharing. I'm here to listen.",
        timestamp: new Date(),
      };
      setAllMessages((prev) => ({
        ...prev,
        [activeConversationId!]: [
          ...(prev[activeConversationId!] ?? []),
          replyMessage,
        ],
      }));

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversationId
            ? {
                ...c,
                lastMessage: replyMessage.text,
                lastMessageTime: replyMessage.timestamp,
              }
            : c,
        ),
      );
    }, 1000);
  };

  return (
    <div className="relative min-h-[calc(100vh-120px)] overflow-hidden rounded-3xl">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-white to-slate-100" />
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="absolute right-0 top-20 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-200/20 blur-3xl" />

      <div className="relative flex h-full flex-col">
        <div className="flex flex-1 overflow-hidden">
          <ConversationList
            conversations={conversations}
            activeId={activeConversationId}
            onSelect={setActiveConversationId}
          />
          <div className="flex flex-1 flex-col">
            <ChatWindow
              messages={activeMessages}
              conversationName={activeConversation?.name ?? "Select a conversation"}
            />
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSend}
            />
          </div>
        </div>
      </div>
    </div>
  );
}