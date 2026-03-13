import { Router } from "express";
import { superAdminOnly } from "../../middleware/rbac";
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../../controllers/admin/userController";

const router = Router();

// All user management requires SUPER_ADMIN
router.get("/", superAdminOnly, listUsers);
router.get("/:id", superAdminOnly, getUser);
router.post("/", superAdminOnly, createUser);
router.patch("/:id", superAdminOnly, updateUser);
router.delete("/:id", superAdminOnly, deleteUser);

export { router as adminUserRouter };
