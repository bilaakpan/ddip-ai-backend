import { Router } from "express";
import { anyRole, editorAndAbove, adminOnly } from "../../middleware/rbac";
import {
  listAiSolutions,
  getAiSolution,
  createAiSolution,
  updateAiSolution,
  deleteAiSolution,
} from "../../controllers/admin/aiSolutionController";

const router = Router();

// GET /api/admin/ai-solutions
router.get("/", anyRole, listAiSolutions);

// GET /api/admin/ai-solutions/:id
router.get("/:id", anyRole, getAiSolution);

// POST /api/admin/ai-solutions
router.post("/", editorAndAbove, createAiSolution);

// PATCH /api/admin/ai-solutions/:id
router.patch("/:id", editorAndAbove, updateAiSolution);

// DELETE /api/admin/ai-solutions/:id
router.delete("/:id", adminOnly, deleteAiSolution);

export { router as adminAiSolutionRouter };
