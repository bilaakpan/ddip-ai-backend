import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendSuccess, sendCreated, sendError } from "../../utils/response";
import { AuthenticatedRequest } from "../../middleware/auth";
import { getParam } from "../../utils/params";

/** GET /api/admin/hero-sliders */
export async function listHeroSliders(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const sliders = await prisma.heroSlider.findMany({
      orderBy: { sortOrder: "asc" },
    });
    sendSuccess(res, sliders);
  } catch (error) {
    sendError(res, "Failed to fetch hero sliders", 500);
  }
}

/** GET /api/admin/hero-sliders/:id */
export async function getHeroSlider(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const slider = await prisma.heroSlider.findUnique({
      where: { id: getParam(req, "id")! },
    });

    if (!slider) {
      sendError(res, "Hero slider not found", 404);
      return;
    }

    sendSuccess(res, slider);
  } catch (error) {
    sendError(res, "Failed to fetch hero slider", 500);
  }
}

/** POST /api/admin/hero-sliders */
export async function createHeroSlider(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { problem, solution, videoUrl, buttonText, buttonHref, sortOrder, isActive } = req.body;

    const slider = await prisma.heroSlider.create({
      data: {
        problem,
        solution,
        videoUrl,
        buttonText,
        buttonHref,
        sortOrder: sortOrder ?? 0,
        isActive: isActive ?? true,
      },
    });

    sendCreated(res, slider);
  } catch (error) {
    sendError(res, "Failed to create hero slider", 500);
  }
}

/** PATCH /api/admin/hero-sliders/:id */
export async function updateHeroSlider(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const id = getParam(req, "id")!;
    const { problem, solution, videoUrl, buttonText, buttonHref, sortOrder, isActive } = req.body;

    const existing = await prisma.heroSlider.findUnique({ where: { id } });
    if (!existing) {
      sendError(res, "Hero slider not found", 404);
      return;
    }

    const slider = await prisma.heroSlider.update({
      where: { id },
      data: {
        ...(problem !== undefined && { problem }),
        ...(solution !== undefined && { solution }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(buttonText !== undefined && { buttonText }),
        ...(buttonHref !== undefined && { buttonHref }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    sendSuccess(res, slider);
  } catch (error) {
    sendError(res, "Failed to update hero slider", 500);
  }
}

/** DELETE /api/admin/hero-sliders/:id */
export async function deleteHeroSlider(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const id = getParam(req, "id")!;

    const existing = await prisma.heroSlider.findUnique({ where: { id } });
    if (!existing) {
      sendError(res, "Hero slider not found", 404);
      return;
    }

    await prisma.heroSlider.delete({ where: { id } });
    sendSuccess(res, { deleted: true });
  } catch (error) {
    sendError(res, "Failed to delete hero slider", 500);
  }
}

/** PATCH /api/admin/hero-sliders/reorder */
export async function reorderHeroSliders(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { items } = req.body as { items: { id: string; sortOrder: number }[] };

    if (!Array.isArray(items)) {
      sendError(res, "items must be an array of { id, sortOrder }", 400);
      return;
    }

    await prisma.$transaction(
      items.map((item) =>
        prisma.heroSlider.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    );

    const sliders = await prisma.heroSlider.findMany({
      orderBy: { sortOrder: "asc" },
    });

    sendSuccess(res, sliders);
  } catch (error) {
    sendError(res, "Failed to reorder hero sliders", 500);
  }
}
