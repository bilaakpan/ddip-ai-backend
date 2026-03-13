import { Router } from "express";
import { anyRole, editorAndAbove } from "../../middleware/rbac";
import {
  listContent,
  getContent,
  updateContent,
} from "../../controllers/admin/contentController";

const router = Router();

// GET /api/admin/content
router.get("/", anyRole, listContent);

// GET /api/admin/content/:key
router.get("/:key", anyRole, getContent);

// PUT /api/admin/content/:key
router.put("/:key", editorAndAbove, updateContent);

export { router as adminContentRouter };
