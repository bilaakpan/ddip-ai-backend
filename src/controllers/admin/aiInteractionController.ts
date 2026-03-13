import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendSuccess, sendPaginated, sendError } from "../../utils/response";
import { parsePagination } from "../../utils/pagination";
import { getParam } from "../../utils/params";

/** GET /api/admin/ai-interactions */
export async function listAIInteractions(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { page, limit, skip } = parsePagination(req.query as Record<string, string>);

    const [interactions, total] = await Promise.all([
      prisma.aIInteraction.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.aIInteraction.count(),
    ]);

    sendPaginated(res, interactions, total, page, limit);
  } catch (error) {
    sendError(res, "Failed to fetch AI interactions", 500);
  }
}

/** GET /api/admin/ai-interactions/:id */
export async function getAIInteraction(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const interaction = await prisma.aIInteraction.findUnique({
      where: { id: getParam(req, "id")! },
    });

    if (!interaction) {
      sendError(res, "AI interaction not found", 404);
      return;
    }

    sendSuccess(res, interaction);
  } catch (error) {
    sendError(res, "Failed to fetch AI interaction", 500);
  }
}

/** DELETE /api/admin/ai-interactions/:id */
export async function deleteAIInteraction(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await prisma.aIInteraction.delete({
      where: { id: getParam(req, "id")! },
    });

    sendSuccess(res, { deleted: true });
  } catch (error) {
    sendError(res, "Failed to delete AI interaction", 500);
  }
}
