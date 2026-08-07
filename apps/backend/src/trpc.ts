import { initTRPC, TRPCError, type AnyRouter } from "@trpc/server";
import { createExpressMiddleware, type CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { AppError } from "./common/errors/AppError";
import cors from "cors"

export interface Context {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
}

const t = initTRPC.context<Context>().create();

export const publicProcedure = t.procedure;
export const router = t.router;

export const createContext = ({ req, res }: CreateExpressContextOptions) => ({ req, res });

export const createTRPCMiddleware = (appRouter: AnyRouter) =>
  createExpressMiddleware({
    router: appRouter,
    createContext,
    middleware: cors()
  });

export function appErrorToTRPC(error: unknown): never {
  if (error instanceof TRPCError) {
    throw error;
  }

  if (error instanceof AppError) {
    let code: TRPCError["code"] = "INTERNAL_SERVER_ERROR";

    if (error.statusCode === 400) {
      code = "BAD_REQUEST";
    } else if (error.statusCode === 401) {
      code = "UNAUTHORIZED";
    } else if (error.statusCode === 404) {
      code = "NOT_FOUND";
    } else if (error.statusCode === 409) {
      code = "CONFLICT";
    }

    throw new TRPCError({ code, message: error.message });
  }

  throw error;
}
