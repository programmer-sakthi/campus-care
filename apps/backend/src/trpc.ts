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


export interface Context {
  req: CreateExpressContextOptions['req'];
  res: CreateExpressContextOptions['res'];

  db: typeof prisma;

  user: any | null;
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

    const token = authHeader.split(' ')[1];

    if (token) {
      user = verifyToken(token);
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
  t.procedure.use(({ ctx, next }) => {


    if (!ctx.user) {

      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Unauthorized',
      });

    }


    return next({
      ctx: {
        user: ctx.user,
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