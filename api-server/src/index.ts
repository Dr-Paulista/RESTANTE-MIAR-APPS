import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided. The platform should set this automatically.",
  );
}

const port = Number(rawPort);
if (!Number.isInteger(port) || port <= 0) {
  throw new Error(`Invalid PORT value: ${rawPort}`);
}

app.listen(port, "0.0.0.0", () => {
  logger.info({ port }, "API server listening");
});
