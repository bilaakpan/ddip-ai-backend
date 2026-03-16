import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth";
import { sendSuccess, sendError } from "../../utils/response";

export async function uploadFile(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    if (!req.file) {
      sendError(res, "No file provided", 400);
      return;
    }

    const { filename, originalname, mimetype, size } = req.file;

    sendSuccess(res, {
      url: `/uploads/${filename}`,
      originalName: originalname,
      mimeType: mimetype,
      size,
    });
  } catch (error) {
    sendError(res, "Failed to upload file", 500);
  }
}
