import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.disable("x-powered-by");
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "200kb" }));
app.use(express.urlencoded({ extended: true, limit: "200kb" }));
app.use(
  pinoHttp({
    logger,
    customProps: () => ({ service: "api-server" }),
    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url,
          id: req.id,
        };
      },
    },
  }),
);

// Clerk middleware is mounted globally, but individual routes can decide whether to require auth.
app.use(clerkMiddleware());

app.use(router);

app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!err) return next();
  if (err?.type === "entity.too.large") {
    return res.status(413).json({
      error: "Mensagem ou arquivo grande demais. Envie em partes menores.",
    });
  }
  logger.error({ err }, "Unhandled API error");
  return res.status(500).json({ error: "Erro interno do servidor." });
});

export default app;
