import {
  initTRPC,
  TRPCError,
  type AnyRouter,
} from '@trpc/server';

import {
  createExpressMiddleware,
  type CreateExpressContextOptions,
} from '@trpc/server/adapters/express';

import { AppError } from './common/errors/AppError';
import { prisma } from '@repo/database';

import cors from 'cors';

import { verifyToken } from './auth/jwt';
import type { JwtPayload } from 'jsonwebtoken';


export interface Context {
  req: CreateExpressContextOptions['req'];
  res: CreateExpressContextOptions['res'];

  db: typeof prisma;

  user: (JwtPayload & { id: string; email: string; type: 'STUDENT' | 'COUNSELLOR' | 'INSTITUTION' }) | null;
}


const t = initTRPC.context<Context>().create();


export const publicProcedure = t.procedure;

export const router = t.router;



export const createContext = ({
  req,
  res,
}: CreateExpressContextOptions): Context => {


  const authHeader = req.headers.authorization;


  let user = null;


  if (authHeader) {

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

    if (token) {
      try {
        user = verifyToken(token) as Context['user'];
      } catch {
        user = null;
      }
    }

  }


  return {
    req,
    res,
    db: prisma,
    user,
  };

};



export const protectedProcedure =
  t.procedure.use(async ({ ctx, next }) => {


    if (!ctx.user) {

      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
      });

    }


    // JWTs deliberately only contain stable authentication claims. Resolve the
    // role-specific identifiers here so every protected route works with the
    // authenticated database user (including tokens issued before new fields
    // were added to the user model).
    const authenticatedUser = await ctx.db.user.findUnique({
      where: { id: ctx.user.id },
      select: {
        id: true,
        email: true,
        type: true,
        studentRegNo: true,
        counsellorEmail: true,
        institutionCode: true,
      },
    });

    if (!authenticatedUser) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'User no longer exists',
      });
    }

    return next({
      ctx: {
        user: authenticatedUser,
      },
    });

  });



export const createTRPCMiddleware = (
  appRouter: AnyRouter,
) =>
  createExpressMiddleware({
    router: appRouter,
    createContext,
    middleware: cors(),
    onError({ path, error, input }) {
      console.error('🔥 tRPC ERROR');
      console.error('PATH:', path);
      console.error('INPUT:', input);
      console.error('MESSAGE:', error.message);
      console.error('CAUSE:', error.cause);
      console.error('STACK:', error.stack);
    },
  });



export function appErrorToTRPC(error: unknown): never {

  if (error instanceof TRPCError) {
    throw error;
  }


  if (error instanceof AppError) {

    let code: TRPCError['code'] =
      'INTERNAL_SERVER_ERROR';


    if (error.statusCode === 400) {
      code = 'BAD_REQUEST';
    } 
    else if (error.statusCode === 401) {
      code = 'UNAUTHORIZED';
    } 
    else if (error.statusCode === 404) {
      code = 'NOT_FOUND';
    } 
    else if (error.statusCode === 409) {
      code = 'CONFLICT';
    }


    throw new TRPCError({
      code,
      message: error.message,
    });

  }


  throw error;

}
