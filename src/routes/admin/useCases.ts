import { Router } from "express";
import { anyRole, editorAndAbove, adminOnly } from "../../middleware/rbac";
import {
  listUseCases,
  getUseCase,
  createUseCase,
  updateUseCase,
  deleteUseCase,
} from "../../controllers/admin/useCaseController";

const router = Router();

// GET /api/admin/use-cases
router.get("/", anyRole, listUseCases);

// GET /api/admin/use-cases/:id
router.get("/:id", anyRole, getUseCase);

// POST /api/admin/use-cases
router.post("/", editorAndAbove, createUseCase);

// PATCH /api/admin/use-cases/:id
router.patch("/:id", editorAndAbove, updateUseCase);

// DELETE /api/admin/use-cases/:id
router.delete("/:id", adminOnly, deleteUseCase);

export { router as adminUseCaseRouter };
