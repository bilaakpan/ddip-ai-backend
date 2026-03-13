import { Router } from "express";
import { anyRole, editorAndAbove, adminOnly } from "../../middleware/rbac";
import {
  listHeroSliders,
  getHeroSlider,
  createHeroSlider,
  updateHeroSlider,
  deleteHeroSlider,
  reorderHeroSliders,
} from "../../controllers/admin/heroSliderController";

const router = Router();

// GET /api/admin/hero-sliders
router.get("/", anyRole, listHeroSliders);

// GET /api/admin/hero-sliders/:id
router.get("/:id", anyRole, getHeroSlider);

// POST /api/admin/hero-sliders
router.post("/", editorAndAbove, createHeroSlider);

// PATCH /api/admin/hero-sliders/reorder — must be before /:id
router.patch("/reorder", editorAndAbove, reorderHeroSliders);

// PATCH /api/admin/hero-sliders/:id
router.patch("/:id", editorAndAbove, updateHeroSlider);

// DELETE /api/admin/hero-sliders/:id
router.delete("/:id", adminOnly, deleteHeroSlider);

export { router as adminHeroSliderRouter };
