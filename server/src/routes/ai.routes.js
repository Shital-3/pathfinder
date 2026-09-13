import { Router } from "express";
import { advisor, analyzeExperience, similar } from "../controllers/ai.controller.js";

const router = Router();
router.post("/advisor", advisor);
router.post("/analyze-experience", analyzeExperience);
router.get("/similar/:id", similar);
export default router;
