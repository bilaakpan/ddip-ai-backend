import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendSuccess, sendError } from "../../utils/response";
import { getParam, getQueryParam } from "../../utils/params";

/**
 * GET /api/content/:key
 * Get a single content block by key.
 */
export async function getContent(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const key = getParam(req, "key")!;

    const content = await prisma.contentBlock.findUnique({
      where: { key },
      select: { key: true, value: true, type: true },
    });

    if (!content) {
      sendError(res, "Content not found", 404);
      return;
    }

    sendSuccess(res, content);
  } catch (error) {
    sendError(res, "Failed to fetch content", 500);
  }
}

/**
 * GET /api/content/bulk?keys=hero_title,about_text
 * Get multiple content blocks by keys.
 */
export async function getContentBulk(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const keysParam = getQueryParam(req, "keys");

    if (!keysParam) {
      sendError(res, "Keys parameter is required", 400);
      return;
    }

    const keys = keysParam.split(",").map((k) => k.trim());

    const contents = await prisma.contentBlock.findMany({
      where: { key: { in: keys } },
      select: { key: true, value: true, type: true },
    });

    sendSuccess(res, contents);
  } catch (error) {
    sendError(res, "Failed to fetch content", 500);
  }
}
