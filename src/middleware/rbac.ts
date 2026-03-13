import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth";

type AllowedRole = "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "VIEWER";

/**
 * Role-Based Access Control middleware.
 * Must be used after authenticate middleware.
 *
 * Permission Matrix (from design-doc.md):
 * ┌─────────────────────────┬─────────────┬───────┬────────┬────────┐
 * │ Feature                 │ SUPER_ADMIN │ ADMIN │ EDITOR │ VIEWER │
 * ├─────────────────────────┼─────────────┼───────┼────────┼────────┤
 * │ View submissions        │ ✅          │ ✅    │ ✅     │ ✅     │
 * │ Update project status   │ ✅          │ ✅    │ ✅     │ ❌     │
 * │ Delete submissions      │ ✅          │ ✅    │ ❌     │ ❌     │
 * │ Edit dynamic content    │ ✅          │ ✅    │ ✅     │ ❌     │
 * │ Manage users            │ ✅          │ ❌    │ ❌     │ ❌     │
 * └─────────────────────────┴─────────────┴───────┴────────┴────────┘
 */
export function requireRole(allowedRoles: AllowedRole[]) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Unauthorized" });
      return;
    }

    if (!allowedRoles.includes(req.user.role as AllowedRole)) {
      res.status(403).json({
        success: false,
        error: "Forbidden: insufficient permissions",
      });
      return;
    }

    next();
  };
}

// ─── Convenience Role Combinations ───

/** All authenticated users */
export const anyRole = requireRole([
  "SUPER_ADMIN",
  "ADMIN",
  "EDITOR",
  "VIEWER",
]);

/** Admin and above */
export const adminOnly = requireRole(["SUPER_ADMIN", "ADMIN"]);

/** Editors and above (can modify content/status) */
export const editorAndAbove = requireRole(["SUPER_ADMIN", "ADMIN", "EDITOR"]);

/** Super admin only (user management) */
export const superAdminOnly = requireRole(["SUPER_ADMIN"]);
