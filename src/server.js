import express from "express";
import cors from "cors";
import pino from "pino-http";
import cookieParser from "cookie-parser";

import routers from "./routers/index.js";
import { getEnvVar } from "./utils/getEnvVar.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";

const PORT = Number(getEnvVar("PORT", "3000"));

export const setupServer = async () => {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  app.use(
    pino({
      transport: {
        target: "pino-pretty",
      },
    })
  );

  app.use(routers);

  app.use("*", notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
