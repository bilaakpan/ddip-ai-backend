import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendSuccess, sendCreated, sendError } from "../../utils/response";
import { AuthenticatedRequest } from "../../middleware/auth";
import { getParam, getQueryParam } from "../../utils/params";

/** GET /api/admin/use-cases?page_slug=ai-influencer */
export async function listUseCases(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const pageSlug = getQueryParam(req, "page_slug");

    const useCases = await prisma.useCase.findMany({
      where: pageSlug ? { pageSlug } : undefined,
      orderBy: [{ pageSlug: "asc" }, { sortOrder: "asc" }],
      include: { tags: { include: { tag: true } } },
    });
    sendSuccess(res, useCases);
  } catch (error) {
    sendError(res, "Failed to fetch use cases", 500);
  }
}

/** GET /api/admin/use-cases/:id */
export async function getUseCase(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const useCase = await prisma.useCase.findUnique({
      where: { id: getParam(req, "id")! },
      include: { tags: { include: { tag: true } } },
    });

    if (!useCase) {
      sendError(res, "Use case not found", 404);
      return;
    }

    sendSuccess(res, useCase);
  } catch (error) {
    sendError(res, "Failed to fetch use case", 500);
  }
}

/** POST /api/admin/use-cases */
export async function createUseCase(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { brand, mediaUrl, mediaType, pageSlug, sortOrder, tagIds } = req.body;

    if (!brand || !pageSlug) {
      sendError(res, "brand and pageSlug are required", 400);
      return;
    }

    const useCase = await prisma.useCase.create({
      data: {
        brand,
        mediaUrl,
        mediaType,
        pageSlug,
        sortOrder: sortOrder ?? 0,
        ...(tagIds?.length && {
          tags: {
            create: tagIds.map((tagId: string) => ({ tagId })),
          },
        }),
      },
      include: { tags: { include: { tag: true } } },
    });

    sendCreated(res, useCase);
  } catch (error) {
    sendError(res, "Failed to create use case", 500);
  }
}

/** PATCH /api/admin/use-cases/:id */
export async function updateUseCase(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const id = getParam(req, "id")!;
    const { brand, mediaUrl, mediaType, pageSlug, sortOrder, tagIds } = req.body;

    const existing = await prisma.useCase.findUnique({ where: { id } });
    if (!existing) {
      sendError(res, "Use case not found", 404);
      return;
    }

    // If tagIds provided, replace all tags
    if (tagIds !== undefined) {
      await prisma.useCaseTag.deleteMany({ where: { useCaseId: id } });
    }

    const useCase = await prisma.useCase.update({
      where: { id },
      data: {
        ...(brand !== undefined && { brand }),
        ...(mediaUrl !== undefined && { mediaUrl }),
        ...(mediaType !== undefined && { mediaType }),
        ...(pageSlug !== undefined && { pageSlug }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(tagIds !== undefined && {
          tags: {
            create: tagIds.map((tagId: string) => ({ tagId })),
          },
        }),
      },
      include: { tags: { include: { tag: true } } },
    });

    sendSuccess(res, useCase);
  } catch (error) {
    sendError(res, "Failed to update use case", 500);
  }
}

/** DELETE /api/admin/use-cases/:id */
export async function deleteUseCase(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const id = getParam(req, "id")!;

    const existing = await prisma.useCase.findUnique({ where: { id } });
    if (!existing) {
      sendError(res, "Use case not found", 404);
      return;
    }

    await prisma.useCase.delete({ where: { id } });
    sendSuccess(res, { deleted: true });
  } catch (error) {
    sendError(res, "Failed to delete use case", 500);
  }
}
