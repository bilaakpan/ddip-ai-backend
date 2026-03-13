import { Router } from "express";
import { anyRole, editorAndAbove, adminOnly } from "../../middleware/rbac";
import {
  listWorks,
  getWork,
  createWork,
  updateWork,
  deleteWork,
} from "../../controllers/admin/workController";

const router = Router();

// GET /api/admin/works
router.get("/", anyRole, listWorks);

// GET /api/admin/works/:id
router.get("/:id", anyRole, getWork);

// POST /api/admin/works
router.post("/", editorAndAbove, createWork);

// PATCH /api/admin/works/:id
router.patch("/:id", editorAndAbove, updateWork);

// DELETE /api/admin/works/:id
router.delete("/:id", adminOnly, deleteWork);

export { router as adminWorkRouter };
