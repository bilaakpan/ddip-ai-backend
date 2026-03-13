import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendSuccess, sendCreated, sendError } from "../../utils/response";
import { AuthenticatedRequest } from "../../middleware/auth";
import { getParam } from "../../utils/params";

/** GET /api/admin/works */
export async function listWorks(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const works = await prisma.work.findMany({
      orderBy: { sortOrder: "asc" },
      include: { tags: { include: { tag: true } } },
    });
    sendSuccess(res, works);
  } catch (error) {
    sendError(res, "Failed to fetch works", 500);
  }
}

/** GET /api/admin/works/:id */
export async function getWork(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const work = await prisma.work.findUnique({
      where: { id: getParam(req, "id")! },
      include: { tags: { include: { tag: true } } },
    });

    if (!work) {
      sendError(res, "Work not found", 404);
      return;
    }

    sendSuccess(res, work);
  } catch (error) {
    sendError(res, "Failed to fetch work", 500);
  }
}

/** POST /api/admin/works */
export async function createWork(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { title, body, field, mediaUrl, mediaType, isHighlighted, sortOrder, tagIds } = req.body;

    if (!title) {
      sendError(res, "title is required", 400);
      return;
    }

    const work = await prisma.work.create({
      data: {
        title,
        body,
        field,
        mediaUrl,
        mediaType,
        isHighlighted: isHighlighted ?? false,
        sortOrder: sortOrder ?? 0,
        ...(tagIds?.length && {
          tags: {
            create: tagIds.map((tagId: string) => ({ tagId })),
          },
        }),
      },
      include: { tags: { include: { tag: true } } },
    });

    sendCreated(res, work);
  } catch (error) {
    sendError(res, "Failed to create work", 500);
  }
}

/** PATCH /api/admin/works/:id */
export async function updateWork(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const id = getParam(req, "id")!;
    const { title, body, field, mediaUrl, mediaType, isHighlighted, sortOrder, tagIds } = req.body;

    const existing = await prisma.work.findUnique({ where: { id } });
    if (!existing) {
      sendError(res, "Work not found", 404);
      return;
    }

    // If tagIds provided, replace all tags
    if (tagIds !== undefined) {
      await prisma.workTag.deleteMany({ where: { workId: id } });
    }

    const work = await prisma.work.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(body !== undefined && { body }),
        ...(field !== undefined && { field }),
        ...(mediaUrl !== undefined && { mediaUrl }),
        ...(mediaType !== undefined && { mediaType }),
        ...(isHighlighted !== undefined && { isHighlighted }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(tagIds !== undefined && {
          tags: {
            create: tagIds.map((tagId: string) => ({ tagId })),
          },
        }),
      },
      include: { tags: { include: { tag: true } } },
    });

    sendSuccess(res, work);
  } catch (error) {
    sendError(res, "Failed to update work", 500);
  }
}

/** DELETE /api/admin/works/:id */
export async function deleteWork(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const id = getParam(req, "id")!;

    const existing = await prisma.work.findUnique({ where: { id } });
    if (!existing) {
      sendError(res, "Work not found", 404);
      return;
    }

    await prisma.work.delete({ where: { id } });
    sendSuccess(res, { deleted: true });
  } catch (error) {
    sendError(res, "Failed to delete work", 500);
  }
}
