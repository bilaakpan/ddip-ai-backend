import { Router } from "express";
import { validate } from "../../middleware/validate";
import { authLimiter } from "../../middleware/rateLimiter";
import { login, refreshToken } from "../../controllers/admin/authController";
import { authenticate } from "../../middleware/auth";
import { z } from "zod";

const router = Router();

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

// POST /api/admin/auth/login
router.post("/login", authLimiter, validate(loginSchema), login);

// POST /api/admin/auth/refresh
router.post("/refresh", authenticate, refreshToken);

export { router as adminAuthRouter };
