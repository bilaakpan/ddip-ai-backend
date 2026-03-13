import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendSuccess, sendCreated, sendError } from "../../utils/response";
import { AuthenticatedRequest } from "../../middleware/auth";
import { getParam, getQueryParam } from "../../utils/params";

/** GET /api/admin/tags?category=work */
export async function listTags(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const category = getQueryParam(req, "category");

    const tags = await prisma.tag.findMany({
      where: category ? { category } : undefined,
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });

    sendSuccess(res, tags);
  } catch (error) {
    sendError(res, "Failed to fetch tags", 500);
  }
}

/** POST /api/admin/tags */
export async function createTag(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { name, category } = req.body;

    if (!name || !category) {
      sendError(res, "name and category are required", 400);
      return;
    }

    const tag = await prisma.tag.create({
      data: { name, category },
    });

    sendCreated(res, tag);
  } catch (error: any) {
    if (error?.code === "P2002") {
      sendError(res, "Tag with this name already exists in this category", 409);
      return;
    }
    sendError(res, "Failed to create tag", 500);
  }
}

/** DELETE /api/admin/tags/:id */
export async function deleteTag(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const id = getParam(req, "id")!;

    const existing = await prisma.tag.findUnique({ where: { id } });
    if (!existing) {
      sendError(res, "Tag not found", 404);
      return;
    }

    await prisma.tag.delete({ where: { id } });
    sendSuccess(res, { deleted: true });
  } catch (error) {
    sendError(res, "Failed to delete tag", 500);
  }
}
