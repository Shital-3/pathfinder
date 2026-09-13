import { Router } from "express";
import { list, detail } from "../controllers/dilemma.controller.js";

const router = Router();
router.get("/", list);
router.get("/:slug", detail);
export default router;
