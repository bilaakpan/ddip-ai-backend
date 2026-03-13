import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../../config/database";
import { sendSuccess, sendCreated, sendError } from "../../utils/response";
import { logger } from "../../utils/logger";
import { getParam } from "../../utils/params";

/** GET /api/admin/users */
export async function listUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    sendSuccess(res, users);
  } catch (error) {
    sendError(res, "Failed to fetch users", 500);
  }
}

/** GET /api/admin/users/:id */
export async function getUser(req: Request, res: Response): Promise<void> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: getParam(req, "id")! },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      sendError(res, "User not found", 404);
      return;
    }

    sendSuccess(res, user);
  } catch (error) {
    sendError(res, "Failed to fetch user", 500);
  }
}

/** POST /api/admin/users */
export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      sendError(res, "Email already registered", 409);
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role: role || "VIEWER",
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    logger.info(`User created: ${user.email} (${user.role})`);

    sendCreated(res, user);
  } catch (error) {
    logger.error("Failed to create user:", error);
    sendError(res, "Failed to create user", 500);
  }
}

/** PATCH /api/admin/users/:id */
export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const { firstName, lastName, role, isActive, password } = req.body;

    const data: Record<string, unknown> = {};
    if (firstName !== undefined) data.firstName = firstName;
    if (lastName !== undefined) data.lastName = lastName;
    if (role !== undefined) data.role = role;
    if (isActive !== undefined) data.isActive = isActive;
    if (password) data.passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.update({
      where: { id: getParam(req, "id")! },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });

    sendSuccess(res, user);
  } catch (error) {
    sendError(res, "Failed to update user", 500);
  }
}

/** DELETE /api/admin/users/:id */
export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    await prisma.user.delete({
      where: { id: getParam(req, "id")! },
    });

    sendSuccess(res, { deleted: true });
  } catch (error) {
    sendError(res, "Failed to delete user", 500);
  }
}
