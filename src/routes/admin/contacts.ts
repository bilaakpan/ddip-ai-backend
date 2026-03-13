import { Router } from "express";
import { anyRole, adminOnly } from "../../middleware/rbac";
import {
  listContacts,
  getContact,
  deleteContact,
} from "../../controllers/admin/contactController";

const router = Router();

router.get("/", anyRole, listContacts);
router.get("/:id", anyRole, getContact);
router.delete("/:id", adminOnly, deleteContact);

export { router as adminContactRouter };
