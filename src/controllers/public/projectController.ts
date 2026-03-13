import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendCreated, sendError } from "../../utils/response";
import { logger } from "../../utils/logger";

/**
 * POST /api/project/submit
 * Submit a project brief (Tell Us Your Project module).
 */
export async function submitProject(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const {
      fullName,
      email,
      phone,
      company,
      title,
      projectType,
      projectDescription,
      influencerDetails,
      styleReference,
      briefDetails,
    } = req.body;

    const submission = await prisma.projectSubmission.create({
      data: {
        fullName,
        email,
        phone,
        company,
        title,
        projectType,
        projectDescription,
        influencerDetails,
        styleReference,
        briefDetails,
        source: (req.headers["x-device-type"] as string) || "desktop",
      },
    });

    logger.info(`New project submission: ${submission.id} (${projectType})`);

    sendCreated(res, { id: submission.id });
  } catch (error) {
    logger.error("Failed to create project submission:", error);
    sendError(res, "Failed to submit project", 500);
  }
}
