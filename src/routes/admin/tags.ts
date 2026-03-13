import { Router } from "express";
import { anyRole, editorAndAbove, adminOnly } from "../../middleware/rbac";
import {
  listTags,
  createTag,
  deleteTag,
} from "../../controllers/admin/tagController";

const router = Router();

// GET /api/admin/tags?category=work
router.get("/", anyRole, listTags);

// POST /api/admin/tags
router.post("/", editorAndAbove, createTag);

// DELETE /api/admin/tags/:id
router.delete("/:id", adminOnly, deleteTag);

export { router as adminTagRouter };
