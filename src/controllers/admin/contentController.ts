import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendSuccess, sendError } from "../../utils/response";
import { AuthenticatedRequest } from "../../middleware/auth";
import { getParam } from "../../utils/params";

/** GET /api/admin/content */
export async function listContent(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const content = await prisma.contentBlock.findMany({
      orderBy: { key: "asc" },
    });

    sendSuccess(res, content);
  } catch (error) {
    sendError(res, "Failed to fetch content", 500);
  }
}

/** GET /api/admin/content/:key */
export async function getContent(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const content = await prisma.contentBlock.findUnique({
      where: { key: getParam(req, "key")! },
    });

    if (!content) {
      sendError(res, "Content block not found", 404);
      return;
    }

    sendSuccess(res, content);
  } catch (error) {
    sendError(res, "Failed to fetch content", 500);
  }
}

/** PUT /api/admin/content/:key */
export async function updateContent(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { value, type } = req.body;

    const key = getParam(req, "key")!;
    const content = await prisma.contentBlock.upsert({
      where: { key },
      create: {
        key,
        value,
        type: type || "TEXT",
        updatedBy: req.user?.id,
      },
      update: {
        value,
        ...(type && { type }),
        updatedBy: req.user?.id,
      },
    });

    sendSuccess(res, content);
  } catch (error) {
    sendError(res, "Failed to update content", 500);
  }
}
