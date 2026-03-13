import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/database";
import { env } from "../../config/env";
import { sendSuccess, sendError } from "../../utils/response";
import { logger } from "../../utils/logger";
import { AuthenticatedRequest } from "../../middleware/auth";

/**
 * POST /api/admin/auth/login
 * Authenticate admin user and return JWT token.
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      sendError(res, "Invalid credentials", 401);
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      sendError(res, "Invalid credentials", 401);
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as string & jwt.SignOptions["expiresIn"] }
    );

    logger.info(`Admin login: ${user.email} (${user.role})`);

    sendSuccess(res, {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    logger.error("Login failed:", error);
    sendError(res, "Login failed", 500);
  }
}

/**
 * POST /api/admin/auth/refresh
 * Issue a new JWT token for an authenticated user.
 */
export async function refreshToken(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.user) {
      sendError(res, "Unauthorized", 401);
      return;
    }

    const token = jwt.sign(
      { userId: req.user.id, email: req.user.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as string & jwt.SignOptions["expiresIn"] }
    );

    sendSuccess(res, { token });
  } catch (error) {
    sendError(res, "Failed to refresh token", 500);
  }
}
