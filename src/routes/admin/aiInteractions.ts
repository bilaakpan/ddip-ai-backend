import { Router } from "express";
import { anyRole, adminOnly } from "../../middleware/rbac";
import {
  listAIInteractions,
  getAIInteraction,
  deleteAIInteraction,
} from "../../controllers/admin/aiInteractionController";

const router = Router();

// GET /api/admin/ai-interactions
router.get("/", anyRole, listAIInteractions);

// GET /api/admin/ai-interactions/:id
router.get("/:id", anyRole, getAIInteraction);

// DELETE /api/admin/ai-interactions/:id
router.delete("/:id", adminOnly, deleteAIInteraction);

export { router as adminAiInteractionRouter };
