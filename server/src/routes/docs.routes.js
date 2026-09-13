import { Router } from "express";
import { success } from "../utils/response.js";

const router = Router();

router.get("/", (req, res) => success(res, {
  name: "Pathfinder API",
  version: "1.0.0",
  authentication: "Bearer JWT",
  endpoints: {
    health: ["GET /api/health"],
    auth: ["POST /api/auth/register", "POST /api/auth/login", "GET /api/auth/me"],
    dilemmas: ["GET /api/dilemmas", "GET /api/dilemmas/:slug"],
    experiences: ["GET /api/experiences", "GET /api/experiences/:id", "POST /api/experiences/submit"],
    contributors: ["GET /api/contributors", "GET /api/contributors/:id"],
    admin: ["GET /api/admin/experiences/pending", "PATCH /api/admin/experiences/:id/approve", "PATCH /api/admin/experiences/:id/reject"],
    ai: ["POST /api/ai/advisor", "POST /api/ai/analyze-experience", "GET /api/ai/similar/:id"],
  },
}, "Pathfinder API documentation"));

export default router;
