import { Router } from "express";
import { pending, approve, reject } from "../controllers/admin.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import requireAdmin from "../middleware/admin.middleware.js";

const router = Router();
router.use(requireAuth, requireAdmin);
router.get("/experiences/pending", pending);
router.patch("/experiences/:id/approve", approve);
router.patch("/experiences/:id/reject", reject);
export default router;
