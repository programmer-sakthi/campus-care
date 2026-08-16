import { EventEmitter, on } from "events";
import { prisma } from "@repo/database";
import { TRPCError, tracked } from "@trpc/server";
import { z } from "zod";

import { AppError } from "../common/errors/AppError";
import {
  appErrorToTRPC,
  protectedProcedure,
  publicProcedure,
  router,
} from "../trpc";
import { verifyToken } from "../auth/jwt";

type ChatUser = {
  type: "STUDENT" | "COUNSELLOR" | "INSTITUTION";
  studentRegNo?: string | null;
  counsellorEmail?: string | null;
};

// Process-wide event bus for new chat messages. Every subscriber for a given
// conversation listens on its own event name, so this scales fine for a single
// backend instance. If you ever run more than one instance of the backend,
// swap this for a Redis pub/sub (or similar) adapter so events fan out across
// processes.
const ee = new EventEmitter();
ee.setMaxListeners(0);

function eventName(conversationId: string) {
  return `message:${conversationId}`;
}

async function assertMembership(conversationId: string, user: ChatUser) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation) {
    throw new AppError(404, "Conversation not found");
  }

  const isMember =
    (user.type === "STUDENT" && user.studentRegNo === conversation.studentRegNo) ||
    (user.type === "COUNSELLOR" && user.counsellorEmail === conversation.counsellorEmail);

  if (!isMember) {
    throw new AppError(403, "You are not part of this conversation");
  }

  return conversation;
}

export const chatRouter = router({
  // Get (or lazily create) the conversation between the current user and the
  // other party. `withId` is the counsellor's email when called by a student,
  // or the student's regNo when called by a counsellor.
  openConversation: protectedProcedure
    .input(
      z.object({
        withId: z.string().min(1),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        let studentRegNo: string;
        let counsellorEmail: string;

        if (ctx.user.type === "STUDENT") {
          if (!ctx.user.studentRegNo) throw new AppError(403, "Student profile required");
          studentRegNo = ctx.user.studentRegNo;
          counsellorEmail = input.withId;

          // Students may start a conversation with any counsellor currently
          // available through their institution; an appointment is not needed.
          const student = await prisma.student.findUnique({
            where: { regNo: studentRegNo },
            select: { institutionCode: true },
          });
          const counsellorIsAvailable = student && await prisma.institutionCounsellor.findUnique({
            where: {
              institutionCode_counsellorEmail: {
                institutionCode: student.institutionCode,
                counsellorEmail,
              },
            },
            select: { status: true },
          });

          if (!counsellorIsAvailable || counsellorIsAvailable.status !== "ACCEPTED") {
            throw new AppError(403, "Counsellor is not available through your institution");
          }
        } else if (ctx.user.type === "COUNSELLOR") {
          if (!ctx.user.counsellorEmail) throw new AppError(403, "Counsellor profile required");
          counsellorEmail = ctx.user.counsellorEmail;
          studentRegNo = input.withId;
        } else {
          throw new AppError(403, "Only students and counsellors can open a chat");
        }

        return await prisma.conversation.upsert({
          where: {
            studentRegNo_counsellorEmail: { studentRegNo, counsellorEmail },
          },
          create: { studentRegNo, counsellorEmail },
          update: {},
          include: { student: true, counsellor: true },
        });
      } catch (error) {
        return appErrorToTRPC(error);
      }
    }),

  // Every conversation the current user is part of, most recently active first.
  conversations: protectedProcedure.query(async ({ ctx }) => {
    try {
      let where: { studentRegNo: string } | { counsellorEmail: string };

      if (ctx.user.type === "STUDENT" && ctx.user.studentRegNo) {
        where = { studentRegNo: ctx.user.studentRegNo };
      } else if (ctx.user.type === "COUNSELLOR" && ctx.user.counsellorEmail) {
        where = { counsellorEmail: ctx.user.counsellorEmail };
      } else {
        throw new AppError(403, "Only students and counsellors have conversations");
      }

      return await prisma.conversation.findMany({
        where,
        include: {
          student: true,
          counsellor: true,
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { updatedAt: "desc" },
      });
    } catch (error) {
      return appErrorToTRPC(error);
    }
  }),

  // Paginated message history, oldest -> newest, for one conversation.
  messages: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(100).default(30),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        await assertMembership(input.conversationId, ctx.user);

        const items = await prisma.message.findMany({
          where: { conversationId: input.conversationId },
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

  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        content: z.string().trim().min(1).max(4000),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const conversation = await assertMembership(input.conversationId, ctx.user);
        const senderType = ctx.user.type === "STUDENT" ? "STUDENT" : "COUNSELLOR";

        const [message] = await prisma.$transaction([
          prisma.message.create({
            data: {
              conversationId: conversation.id,
              senderType,
              content: input.content,
            },
          }),
          prisma.conversation.update({
            where: { id: conversation.id },
            data: { updatedAt: new Date() },
          }),
        ]);

        ee.emit(eventName(conversation.id), message);

        return message;
      } catch (error) {
        return appErrorToTRPC(error);
      }
    }),

  // Live stream of new messages for one conversation, over SSE.
  //
  // This can't be `protectedProcedure`: the browser's EventSource can't send
  // custom headers, so there's no Authorization header for createContext to
  // read here. Instead the JWT rides along as part of the subscription input
  // (tRPC sends subscription input as query params for SSE) and we verify it
  // by hand.
  onMessage: publicProcedure
    .input(
      z.object({
        conversationId: z.string(),
        token: z.string(),
        lastEventId: z.string().nullish(),
      }),
    )
    .subscription(async function* ({ input, signal }) {
      let payload: { id: string };
      try {
        payload = verifyToken(input.token) as { id: string };
      } catch {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid or expired session" });
      }

      const user = await prisma.user.findUnique({ where: { id: payload.id } });
      if (!user) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "User no longer exists" });
      }

      await assertMembership(input.conversationId, {
        type: user.type,
        studentRegNo: user.studentRegNo,
        counsellorEmail: user.counsellorEmail,
      });

      // Subscribe first so nothing emitted while we fetch the replay batch is lost.
      const iterable = on(ee, eventName(input.conversationId), { signal });

      if (input.lastEventId) {
        const anchor = await prisma.message.findUnique({
          where: { id: input.lastEventId },
        });

        if (anchor) {
          const missed = await prisma.message.findMany({
            where: {
              conversationId: input.conversationId,
              createdAt: { gt: anchor.createdAt },
            },
            orderBy: { createdAt: "asc" },
          });
          for (const message of missed) {
            yield tracked(message.id, message);
          }
        }
      }

      for await (const [message] of iterable) {
        const m = message as { id: string };
        yield tracked(m.id, message);
      }
    }),
});
