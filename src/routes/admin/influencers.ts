import { Router } from "express";
import { anyRole, editorAndAbove, adminOnly } from "../../middleware/rbac";
import {
  listInfluencers,
  getInfluencer,
  createInfluencer,
  updateInfluencer,
  deleteInfluencer,
  reorderInfluencers,
} from "../../controllers/admin/influencerController";

const router = Router();

// GET /api/admin/influencers
router.get("/", anyRole, listInfluencers);

// GET /api/admin/influencers/:id
router.get("/:id", anyRole, getInfluencer);

// POST /api/admin/influencers
router.post("/", editorAndAbove, createInfluencer);

// PATCH /api/admin/influencers/reorder — must be before /:id
router.patch("/reorder", editorAndAbove, reorderInfluencers);

// PATCH /api/admin/influencers/:id
router.patch("/:id", editorAndAbove, updateInfluencer);

// DELETE /api/admin/influencers/:id
router.delete("/:id", adminOnly, deleteInfluencer);

export { router as adminInfluencerRouter };
