import { Router } from "express";
import { submit } from "../controllers/submission.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();
router.post("/", requireAuth, submit);
export default router;
