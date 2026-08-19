import { useEffect, useRef } from "react";

import ChatHeader from "./components/ChatHeader";
import ChatInput from "./components/ChatInput";
import EmptyState from "./components/EmptyState";
import MessageBubble from "./components/MessageBubble";
import TypingIndicator from "./components/TypingIndicator";
import { useChatbotMessages } from "./hooks/useChatbotMessages";

export default function ChatBot() {
  const {
    messages,
    chats,
    activeChatId,
    selectChat,
    newChat,
    isLoadingHistory,
    isSending,
    send,
  } = useChatbotMessages();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isSending]);

  return (
    <div className="mx-auto flex min-h-screen w-full  flex-col px-4 pb-6 pt-12">
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <ChatHeader
          chats={chats}
          activeChatId={activeChatId}
          isCreating={isSending}
          onSelectChat={selectChat}
          onNewChat={newChat}
        />

        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
          {!isLoadingHistory && messages.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {isSending && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <ChatInput disabled={isSending || !activeChatId} onSend={send} />
      </section>
    </div>
  );
}
