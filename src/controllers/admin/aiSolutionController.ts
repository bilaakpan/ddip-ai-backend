import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendSuccess, sendCreated, sendError } from "../../utils/response";
import { AuthenticatedRequest } from "../../middleware/auth";
import { getParam } from "../../utils/params";

/** GET /api/admin/ai-solutions */
export async function listAiSolutions(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const solutions = await prisma.aiSolution.findMany({
      orderBy: { sortOrder: "asc" },
      include: { tags: { include: { tag: true } } },
    });
    sendSuccess(res, solutions);
  } catch (error) {
    sendError(res, "Failed to fetch AI solutions", 500);
  }
}

/** GET /api/admin/ai-solutions/:id */
export async function getAiSolution(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const solution = await prisma.aiSolution.findUnique({
      where: { id: getParam(req, "id")! },
      include: { tags: { include: { tag: true } } },
    });

    if (!solution) {
      sendError(res, "AI solution not found", 404);
      return;
    }

    sendSuccess(res, solution);
  } catch (error) {
    sendError(res, "Failed to fetch AI solution", 500);
  }
}

/** POST /api/admin/ai-solutions */
export async function createAiSolution(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { title, body, mediaUrl, mediaType, slug, sortOrder, tagIds } = req.body;

    if (!title || !slug) {
      sendError(res, "title and slug are required", 400);
      return;
    }

    const solution = await prisma.aiSolution.create({
      data: {
        title,
        body,
        mediaUrl,
        mediaType,
        slug,
        sortOrder: sortOrder ?? 0,
        ...(tagIds?.length && {
          tags: {
            create: tagIds.map((tagId: string) => ({ tagId })),
          },
        }),
      },
      include: { tags: { include: { tag: true } } },
    });

    sendCreated(res, solution);
  } catch (error) {
    sendError(res, "Failed to create AI solution", 500);
  }
}

/** PATCH /api/admin/ai-solutions/:id */
export async function updateAiSolution(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const id = getParam(req, "id")!;
    const { title, body, mediaUrl, mediaType, slug, sortOrder, tagIds } = req.body;

    const existing = await prisma.aiSolution.findUnique({ where: { id } });
    if (!existing) {
      sendError(res, "AI solution not found", 404);
      return;
    }

    // If tagIds provided, replace all tags
    if (tagIds !== undefined) {
      await prisma.aiSolutionTag.deleteMany({ where: { solutionId: id } });
    }

    const solution = await prisma.aiSolution.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(body !== undefined && { body }),
        ...(mediaUrl !== undefined && { mediaUrl }),
        ...(mediaType !== undefined && { mediaType }),
        ...(slug !== undefined && { slug }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(tagIds !== undefined && {
          tags: {
            create: tagIds.map((tagId: string) => ({ tagId })),
          },
        }),
      },
      include: { tags: { include: { tag: true } } },
    });

    sendSuccess(res, solution);
  } catch (error) {
    sendError(res, "Failed to update AI solution", 500);
  }
}

/** DELETE /api/admin/ai-solutions/:id */
export async function deleteAiSolution(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const id = getParam(req, "id")!;

    const existing = await prisma.aiSolution.findUnique({ where: { id } });
    if (!existing) {
      sendError(res, "AI solution not found", 404);
      return;
    }

    await prisma.aiSolution.delete({ where: { id } });
    sendSuccess(res, { deleted: true });
  } catch (error) {
    sendError(res, "Failed to delete AI solution", 500);
  }
}
