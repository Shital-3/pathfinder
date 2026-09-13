import { Router } from "express";
import { list, detail, experiences } from "../controllers/contributor.controller.js";

const router = Router();
router.get("/", list);
router.get("/:id/experiences", experiences);
router.get("/:id", detail);
export default router;
