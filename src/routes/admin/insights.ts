import { Router } from "express";
import { anyRole, editorAndAbove, adminOnly } from "../../middleware/rbac";
import {
  listInsights,
  getInsight,
  createInsight,
  updateInsight,
  deleteInsight,
} from "../../controllers/admin/insightController";

const router = Router();

// GET /api/admin/insights
router.get("/", anyRole, listInsights);

// GET /api/admin/insights/:id
router.get("/:id", anyRole, getInsight);

// POST /api/admin/insights
router.post("/", editorAndAbove, createInsight);

// PATCH /api/admin/insights/:id
router.patch("/:id", editorAndAbove, updateInsight);

// DELETE /api/admin/insights/:id
router.delete("/:id", adminOnly, deleteInsight);

export { router as adminInsightRouter };
