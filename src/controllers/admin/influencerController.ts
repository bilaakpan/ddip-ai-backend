import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendSuccess, sendCreated, sendError } from "../../utils/response";
import { AuthenticatedRequest } from "../../middleware/auth";
import { getParam, getQueryParam } from "../../utils/params";

/** GET /api/admin/influencers */
export async function listInfluencers(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const category = getQueryParam(req, "category");
    const region = getQueryParam(req, "region");

    const influencers = await prisma.influencer.findMany({
      where: {
        ...(category && { category }),
        ...(region && { region }),
      },
      orderBy: { sortOrder: "asc" },
    });
    sendSuccess(res, influencers);
  } catch (error) {
    sendError(res, "Failed to fetch influencers", 500);
  }
}

/** GET /api/admin/influencers/:id */
export async function getInfluencer(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const influencer = await prisma.influencer.findUnique({
      where: { id: getParam(req, "id")! },
    });

    if (!influencer) {
      sendError(res, "Influencer not found", 404);
      return;
    }

    sendSuccess(res, influencer);
  } catch (error) {
    sendError(res, "Failed to fetch influencer", 500);
  }
}

/** POST /api/admin/influencers */
export async function createInfluencer(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const {
      name, surname, country, countryCode, region, language,
      category, persona, gender, title, summary, profile,
      contentFocus, visualStyle, tone, brandFit,
      imageUrl, videoUrl, textOnImage,
      showOnHomepage, showOnAiinf, sortOrder,
    } = req.body;

    if (!name) {
      sendError(res, "name is required", 400);
      return;
    }

    const influencer = await prisma.influencer.create({
      data: {
        name,
        surname,
        country,
        countryCode,
        region,
        language,
        category,
        persona,
        gender,
        title,
        summary,
        profile,
        contentFocus,
        visualStyle,
        tone,
        brandFit,
        imageUrl,
        videoUrl,
        textOnImage,
        showOnHomepage: showOnHomepage ?? false,
        showOnAiinf: showOnAiinf ?? true,
        sortOrder: sortOrder ?? 0,
      },
    });

    sendCreated(res, influencer);
  } catch (error) {
    sendError(res, "Failed to create influencer", 500);
  }
}

/** PATCH /api/admin/influencers/:id */
export async function updateInfluencer(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const id = getParam(req, "id")!;
    const {
      name, surname, country, countryCode, region, language,
      category, persona, gender, title, summary, profile,
      contentFocus, visualStyle, tone, brandFit,
      imageUrl, videoUrl, textOnImage,
      showOnHomepage, showOnAiinf, sortOrder,
    } = req.body;

    const existing = await prisma.influencer.findUnique({ where: { id } });
    if (!existing) {
      sendError(res, "Influencer not found", 404);
      return;
    }

    const influencer = await prisma.influencer.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(surname !== undefined && { surname }),
        ...(country !== undefined && { country }),
        ...(countryCode !== undefined && { countryCode }),
        ...(region !== undefined && { region }),
        ...(language !== undefined && { language }),
        ...(category !== undefined && { category }),
        ...(persona !== undefined && { persona }),
        ...(gender !== undefined && { gender }),
        ...(title !== undefined && { title }),
        ...(summary !== undefined && { summary }),
        ...(profile !== undefined && { profile }),
        ...(contentFocus !== undefined && { contentFocus }),
        ...(visualStyle !== undefined && { visualStyle }),
        ...(tone !== undefined && { tone }),
        ...(brandFit !== undefined && { brandFit }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(textOnImage !== undefined && { textOnImage }),
        ...(showOnHomepage !== undefined && { showOnHomepage }),
        ...(showOnAiinf !== undefined && { showOnAiinf }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    sendSuccess(res, influencer);
  } catch (error) {
    sendError(res, "Failed to update influencer", 500);
  }
}

/** DELETE /api/admin/influencers/:id */
export async function deleteInfluencer(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const id = getParam(req, "id")!;

    const existing = await prisma.influencer.findUnique({ where: { id } });
    if (!existing) {
      sendError(res, "Influencer not found", 404);
      return;
    }

    await prisma.influencer.delete({ where: { id } });
    sendSuccess(res, { deleted: true });
  } catch (error) {
    sendError(res, "Failed to delete influencer", 500);
  }
}

/** PATCH /api/admin/influencers/reorder */
export async function reorderInfluencers(
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
        prisma.influencer.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    );

    sendSuccess(res, { reordered: true });
  } catch (error) {
    sendError(res, "Failed to reorder influencers", 500);
  }
}
