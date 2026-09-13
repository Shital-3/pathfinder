import "dotenv/config";
import "./config/env.js";
import express from "express";
import corsMiddleware from "./config/cors.js";
import healthRoutes from "./routes/health.routes.js";
import docsRoutes from "./routes/docs.routes.js";
import openapiRoutes from "./routes/openapi.routes.js";
import authRoutes from "./routes/auth.routes.js";
import dilemmaRoutes from "./routes/dilemma.routes.js";
import experienceRoutes from "./routes/experience.routes.js";
import contributorRoutes from "./routes/contributor.routes.js";
import submissionRoutes from "./routes/submission.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import aiRateLimiter from "./middleware/aiRateLimiter.js";
import { requireAuth } from "./middleware/auth.middleware.js";
import { loginRateLimiter } from "./middleware/loginRateLimiter.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import requestLogger from "./middleware/requestLogger.js";

const app = express();

app.disable("x-powered-by");
app.disable("etag");
app.use(corsMiddleware);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(requestLogger);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Pathfinder API",
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/docs", docsRoutes);
app.use("/api/openapi.json", openapiRoutes);
app.use("/api/auth", loginRateLimiter, authRoutes);
app.use("/api/dilemmas", dilemmaRoutes);
app.use("/api/contributors", contributorRoutes);
app.use("/api/experiences/submit", submissionRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", requireAuth, aiRateLimiter, aiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;