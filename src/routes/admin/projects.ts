import { Router } from "express";
import { anyRole, editorAndAbove, adminOnly } from "../../middleware/rbac";
import {
  listProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../../controllers/admin/projectController";

const router = Router();

// GET /api/admin/projects
router.get("/", anyRole, listProjects);

// GET /api/admin/projects/:id
router.get("/:id", anyRole, getProject);

// PATCH /api/admin/projects/:id
router.patch("/:id", editorAndAbove, updateProject);

// DELETE /api/admin/projects/:id
router.delete("/:id", adminOnly, deleteProject);

export { router as adminProjectRouter };
