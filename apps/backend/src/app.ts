import express from "express";


import pinoHttp from "pino-http";

import logger from "./config/logger";


const app = express();

app.use(express.json());

app.use(
  pinoHttp({
    logger,
  }),
);

export { app };