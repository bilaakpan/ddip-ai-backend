import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendCreated, sendError } from "../../utils/response";
import { logger } from "../../utils/logger";

/**
 * POST /api/ai-interaction
 * Submit an AI interaction (Talk to Our AI module).
 */
export async function submitAIInteraction(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { name, email, phone, message, category } = req.body;

    const interaction = await prisma.aIInteraction.create({
      data: {
        name,
        email,
        phone,
        message,
        category,
        source: req.headers["x-device-type"] as string || "desktop",
        ipAddress: req.ip,
      },
    });

    logger.info(`New AI interaction: ${interaction.id}`);

    sendCreated(res, { id: interaction.id });
  } catch (error) {
    logger.error("Failed to create AI interaction:", error);
    sendError(res, "Failed to submit interaction", 500);
  }
}
