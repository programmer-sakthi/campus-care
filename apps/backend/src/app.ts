import express from "express";
import cors from "cors";

import pinoHttp from "pino-http";

import logger from "./config/logger";
import { createTRPCMiddleware } from "./trpc";
import { appRouter } from "./router";

const app = express();
app.use(cors());

const trpcMiddleware = createTRPCMiddleware(appRouter)

app.use("/trpc", trpcMiddleware);

app.use(
  pinoHttp({
    logger,
  }),
);

export { app };