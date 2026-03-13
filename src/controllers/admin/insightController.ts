import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendSuccess, sendCreated, sendPaginated, sendError } from "../../utils/response";
import { AuthenticatedRequest } from "../../middleware/auth";
import { getParam, getQueryParam } from "../../utils/params";
import { parsePagination } from "../../utils/pagination";

/** GET /api/admin/insights?page=1&limit=20&category=ai */
export async function listInsights(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { page, limit, skip } = parsePagination(req.query as { page?: string; limit?: string });
    const category = getQueryParam(req, "category");

    const where = category ? { category } : {};

    const [insights, total] = await Promise.all([
      prisma.insight.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.insight.count({ where }),
    ]);

    sendPaginated(res, insights, total, page, limit);
  } catch (error) {
    sendError(res, "Failed to fetch insights", 500);
  }
}

/** GET /api/admin/insights/:id */
export async function getInsight(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const insight = await prisma.insight.findUnique({
      where: { id: getParam(req, "id")! },
    });

    if (!insight) {
      sendError(res, "Insight not found", 404);
      return;
    }

    sendSuccess(res, insight);
  } catch (error) {
    sendError(res, "Failed to fetch insight", 500);
  }
}

/** POST /api/admin/insights */
export async function createInsight(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const {
      title, slug, category, imageUrl, body,
      publishedAt, seoTitle, seoDescription, seoOgImage,
    } = req.body;

    if (!title || !slug || !body) {
      sendError(res, "title, slug, and body are required", 400);
      return;
    }

    const insight = await prisma.insight.create({
      data: {
        title,
        slug,
        category,
        imageUrl,
        body,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        seoTitle,
        seoDescription,
        seoOgImage,
      },
    });

    sendCreated(res, insight);
  } catch (error) {
    sendError(res, "Failed to create insight", 500);
  }
}

/** PATCH /api/admin/insights/:id */
export async function updateInsight(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const id = getParam(req, "id")!;
    const {
      title, slug, category, imageUrl, body,
      publishedAt, seoTitle, seoDescription, seoOgImage,
    } = req.body;

    const existing = await prisma.insight.findUnique({ where: { id } });
    if (!existing) {
      sendError(res, "Insight not found", 404);
      return;
    }

    const insight = await prisma.insight.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(category !== undefined && { category }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(body !== undefined && { body }),
        ...(publishedAt !== undefined && { publishedAt: new Date(publishedAt) }),
        ...(seoTitle !== undefined && { seoTitle }),
        ...(seoDescription !== undefined && { seoDescription }),
        ...(seoOgImage !== undefined && { seoOgImage }),
      },
    });

    sendSuccess(res, insight);
  } catch (error) {
    sendError(res, "Failed to update insight", 500);
  }
}

/** DELETE /api/admin/insights/:id */
export async function deleteInsight(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const id = getParam(req, "id")!;

    const existing = await prisma.insight.findUnique({ where: { id } });
    if (!existing) {
      sendError(res, "Insight not found", 404);
      return;
    }

    await prisma.insight.delete({ where: { id } });
    sendSuccess(res, { deleted: true });
  } catch (error) {
    sendError(res, "Failed to delete insight", 500);
  }
}
