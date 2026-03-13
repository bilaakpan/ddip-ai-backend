import { Router } from "express";
import { anyRole, editorAndAbove, adminOnly } from "../../middleware/rbac";
import {
  listFilterOptions,
  createFilterOption,
  deleteFilterOption,
} from "../../controllers/admin/filterOptionController";

const router = Router();

// GET /api/admin/filter-options?group=influencer_region
router.get("/", anyRole, listFilterOptions);

// POST /api/admin/filter-options
router.post("/", editorAndAbove, createFilterOption);

// DELETE /api/admin/filter-options/:id
router.delete("/:id", adminOnly, deleteFilterOption);

export { router as adminFilterOptionRouter };
