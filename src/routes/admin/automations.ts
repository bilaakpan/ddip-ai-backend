import { Router } from "express";
import { anyRole, editorAndAbove, adminOnly } from "../../middleware/rbac";
import {
  listAutomations,
  getAutomation,
  createAutomation,
  updateAutomation,
  deleteAutomation,
  listAutomationIcons,
  createAutomationIcon,
  deleteAutomationIcon,
} from "../../controllers/admin/automationController";

const router = Router();

// ─── Automations ───

// GET /api/admin/automations
router.get("/", anyRole, listAutomations);

// GET /api/admin/automations/icons — must be before /:id
router.get("/icons", anyRole, listAutomationIcons);

// GET /api/admin/automations/:id
router.get("/:id", anyRole, getAutomation);

// POST /api/admin/automations
router.post("/", editorAndAbove, createAutomation);

// POST /api/admin/automations/icons
router.post("/icons", editorAndAbove, createAutomationIcon);

// PATCH /api/admin/automations/:id
router.patch("/:id", editorAndAbove, updateAutomation);

// DELETE /api/admin/automations/icons/:id
router.delete("/icons/:id", adminOnly, deleteAutomationIcon);

// DELETE /api/admin/automations/:id
router.delete("/:id", adminOnly, deleteAutomation);

export { router as adminAutomationRouter };
