import { prisma, $Enums } from "@repo/database";
import { z } from "zod";

import { AppError } from "../common/errors/AppError";
import { getChatbotReply, type ChatTurn } from "../lib/mlService";
import { appErrorToTRPC, protectedProcedure, router } from "../trpc";

const RISK_LEVEL_MAP: Record<string, $Enums.RiskLevel> = {
  none: $Enums.RiskLevel.NONE,
  low: $Enums.RiskLevel.LOW,
  medium: $Enums.RiskLevel.MEDIUM,
  high: $Enums.RiskLevel.HIGH,
  critical: $Enums.RiskLevel.CRITICAL,
};

// How many recent turns to hand to ml-service as short-term conversational
// context. Long-term facts (name, recurring issues, etc.) live in
// ml-service's own vector memory and don't depend on this window.
const HISTORY_WINDOW = 12;

function requireStudent(user: { type: string; studentRegNo?: string | null }) {
  if (user.type !== "STUDENT" || !user.studentRegNo) {
    throw new AppError(403, "Only students can use the AI companion");
  }
  return user.studentRegNo;
}

export const chatbotRouter = router({
  chats: protectedProcedure.query(async ({ ctx }) => {
    try {
      const studentRegNo = requireStudent(ctx.user);
      return prisma.chatbotChat.findMany({
        where: { studentRegNo },
        orderBy: { updatedAt: "desc" },
        include: { _count: { select: { messages: true } } },
      });
    } catch (error) {
      return appErrorToTRPC(error);
    }
  }),

  createChat: protectedProcedure
    .input(z.object({ title: z.string().trim().min(1).max(100).optional() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const studentRegNo = requireStudent(ctx.user);
        return await prisma.chatbotChat.create({
          data: { studentRegNo, title: input.title ?? "New chat" },
        });
      } catch (error) {
        return appErrorToTRPC(error);
      }
    }),

  // Send a message to Emora. Persists the student's message, calls
  // ml-service for a reply (RAG + long-term memory), persists and returns
  // the reply.
  sendMessage: protectedProcedure
    .input(
      z.object({
        // Legacy chats created during the migration have deterministic IDs,
        // not CUIDs. Ownership is enforced by the database lookup below.
        chatId: z.string().min(1).max(64),
        content: z.string().trim().min(1).max(4000),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const studentRegNo = requireStudent(ctx.user);

        const chat = await prisma.chatbotChat.findFirst({
          where: { id: input.chatId, studentRegNo },
          select: { id: true, title: true },
        });
        if (!chat) throw new AppError(404, "Chat not found");

        const userMessage = await prisma.chatbotMessage.create({
          data: {
            chatId: chat.id,
            role: "USER",
            content: input.content,
          },
        });

        const recent = await prisma.chatbotMessage.findMany({
          // The current message is sent separately below. Exclude it by ID
          // instead of assuming it is first in a timestamp sort; messages can
          // share the same timestamp and make that assumption unsafe.
          where: { chatId: chat.id, id: { not: userMessage.id } },
          orderBy: { createdAt: "desc" },
          take: HISTORY_WINDOW,
        });

        // The model expects recent history oldest -> newest. The current
        // message is provided separately as `message`.
        const history: ChatTurn[] = recent
          .reverse()
          .map((m) => ({
            role: m.role === "USER" ? "user" : "assistant",
            content: m.content,
          }));

        let mlResponse;
        try {
          mlResponse = await getChatbotReply({
            studentId: studentRegNo,
            message: input.content,
            history,
          });
        } catch (error) {
          throw new AppError(502, "Emora is unavailable right now, please try again in a moment");
        }

        const assistantMessage = await prisma.chatbotMessage.create({
          data: {
            chatId: chat.id,
            role: "ASSISTANT",
            content: mlResponse.reply,
            riskLevel: RISK_LEVEL_MAP[mlResponse.risk_level] ?? $Enums.RiskLevel.NONE,
          },
        });

        await prisma.chatbotChat.update({
          where: { id: chat.id },
          data: {
            updatedAt: new Date(),
            // Give an untitled chat a useful label once it has a first turn.
            ...(chat.title === "New chat" ? { title: input.content.slice(0, 60) } : {}),
          },
        });

        return { userMessage, assistantMessage };
      } catch (error) {
        return appErrorToTRPC(error);
      }
    }),

  // Paginated chat history, oldest -> newest, for the current student.
  history: protectedProcedure
    .input(
      z.object({
        chatId: z.string().min(1).max(64),
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(100).default(30),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        const studentRegNo = requireStudent(ctx.user);

        const chat = await prisma.chatbotChat.findFirst({
          where: { id: input.chatId, studentRegNo },
          select: { id: true },
        });
        if (!chat) throw new AppError(404, "Chat not found");

        const items = await prisma.chatbotMessage.findMany({
          where: { chatId: chat.id },
          orderBy: { createdAt: "desc" },
          take: input.limit + 1,
          ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
        });

        let nextCursor: string | undefined;
        if (items.length > input.limit) {
          nextCursor = items.pop()?.id;
        }

        return {
          messages: items.reverse(),
          nextCursor,
        };
      } catch (error) {
        return appErrorToTRPC(error);
      }
    }),
});
