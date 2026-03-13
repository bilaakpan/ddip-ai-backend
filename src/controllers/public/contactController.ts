import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendCreated, sendError } from "../../utils/response";
import { logger } from "../../utils/logger";

/**
 * POST /api/contact/submit
 * Submit a contact form (Contact / WhatsApp module).
 */
export async function submitContact(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { name, email, phone, subject, message } = req.body;

    const submission = await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        source: (req.headers["x-device-type"] as string) || "desktop",
      },
    });

    logger.info(`New contact submission: ${submission.id}`);

    sendCreated(res, { id: submission.id });
  } catch (error) {
    logger.error("Failed to create contact submission:", error);
    sendError(res, "Failed to submit contact form", 500);
  }
}
