import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { modulesRouter } from "./routes/modules.js";
import { challengesRouter } from "./routes/challenges.js";
import { sandboxRouter } from "./routes/sandbox.js";
import { introspectRouter } from "./routes/introspect.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: config.clientUrl }));
app.use(express.json());
app.use(requestLogger);

app.use("/api/modules", modulesRouter);
app.use("/api/challenges", challengesRouter);
app.use("/api/sandbox", sandboxRouter);
app.use("/api/introspect", introspectRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
