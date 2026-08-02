import express from "express";
import cors from "cors";

import pinoHttp from "pino-http";

import logger from "./config/logger";

import router from "./routes/routes";


const app = express();
app.use(cors());
app.use(express.json());

app.use(router);

app.use(
  pinoHttp({
    logger,
  }),
);

export { app };