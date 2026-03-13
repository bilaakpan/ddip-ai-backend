import { Router } from "express";
import { anyRole, editorAndAbove, adminOnly } from "../../middleware/rbac";
import {
  listFaqs,
  getFaq,
  createFaq,
  updateFaq,
  deleteFaq,
  reorderFaqs,
} from "../../controllers/admin/faqController";

const router = Router();

// GET /api/admin/faqs?page_slug=main
router.get("/", anyRole, listFaqs);

// GET /api/admin/faqs/:id
router.get("/:id", anyRole, getFaq);

// POST /api/admin/faqs
router.post("/", editorAndAbove, createFaq);

// PATCH /api/admin/faqs/reorder — must be before /:id
router.patch("/reorder", editorAndAbove, reorderFaqs);

// PATCH /api/admin/faqs/:id
router.patch("/:id", editorAndAbove, updateFaq);

// DELETE /api/admin/faqs/:id
router.delete("/:id", adminOnly, deleteFaq);

export { router as adminFaqRouter };
