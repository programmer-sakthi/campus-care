import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { trpc } from "../../../lib/trpc";
import type { ChatbotChat, ChatbotMessage } from "../types";

let optimisticIdCounter = 0;

export function useChatbotMessages() {
  const chatsQuery = useQuery(trpc.chatbot.chats.queryOptions());
  const [activeChatId, setActiveChatId] = useState<string>();
  const [messages, setMessages] = useState<ChatbotMessage[]>([]);
  const historyQuery = useQuery({
    ...trpc.chatbot.history.queryOptions({ chatId: activeChatId ?? "", limit: 50 }),
    enabled: Boolean(activeChatId),
  });

  useEffect(() => {
    const chats = chatsQuery.data as ChatbotChat[] | undefined;
    if (!activeChatId && chats?.length) setActiveChatId(chats[0].id);
  }, [activeChatId, chatsQuery.data]);

  useEffect(() => {
    setMessages([]);
  }, [activeChatId]);

  useEffect(() => {
    if (historyQuery.data) {
      setMessages(historyQuery.data.messages as ChatbotMessage[]);
    }
  }, [historyQuery.data]);

  const sendMessage = useMutation(
    trpc.chatbot.sendMessage.mutationOptions({
      onMutate: async (input) => {
        const optimisticMessage: ChatbotMessage = {
          id: `optimistic-${optimisticIdCounter++}`,
          role: "USER",
          content: input.content,
          riskLevel: "NONE",
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, optimisticMessage]);
        return { optimisticId: optimisticMessage.id };
      },
      onSuccess: (data, _input, context) => {
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== context?.optimisticId),
          data.userMessage as ChatbotMessage,
          data.assistantMessage as ChatbotMessage,
        ]);
        void chatsQuery.refetch();
      },
      onError: (_error, _input, context) => {
        // Leave the optimistic bubble but drop the "sending" state — the
        // caller surfaces `sendMessage.isError` so the UI can show a retry.
        void context;
      },
    }),
  );

  const createChat = useMutation(
    trpc.chatbot.createChat.mutationOptions({
      onSuccess: (chat) => {
        setActiveChatId(chat.id);
        void chatsQuery.refetch();
      },
    }),
  );

  function send(content: string) {
    const trimmed = content.trim();
    if (!trimmed || sendMessage.isPending) return;
    if (!activeChatId) return;
    sendMessage.mutate({ chatId: activeChatId, content: trimmed });
  }

  function newChat() {
    if (!createChat.isPending) createChat.mutate({});
  }

  return {
    messages,
    chats: (chatsQuery.data ?? []) as ChatbotChat[],
    activeChatId,
    selectChat: setActiveChatId,
    newChat,
    isLoadingHistory: historyQuery.isLoading,
    isSending: sendMessage.isPending || createChat.isPending,
    isError: sendMessage.isError,
    send,
  };
}
