import { Response } from "express";
import { AuthenticatedRequest } from "../../middleware/auth";
import { sendSuccess, sendError } from "../../utils/response";

/**
 * Returns the public origin used to serve uploaded files.
 * Priority:
 *   1. PUBLIC_URL env var (set this on Railway to e.g. https://backend-api-production-a9fc.up.railway.app)
 *   2. Inferred from request headers (works behind Railway's proxy via x-forwarded-* / Host)
 */
function getPublicOrigin(req: AuthenticatedRequest): string {
  const fromEnv = process.env.PUBLIC_URL || process.env.PUBLIC_BASE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const proto =
    (req.headers["x-forwarded-proto"] as string)?.split(",")[0]?.trim() ||
    req.protocol ||
    "https";
  const host =
    (req.headers["x-forwarded-host"] as string)?.split(",")[0]?.trim() ||
    req.get("host") ||
    "";
  return `${proto}://${host}`;
}

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
    const origin = getPublicOrigin(req);
    const absoluteUrl = `${origin}/uploads/${filename}`;

    sendSuccess(res, {
      url: absoluteUrl,
      originalName: originalname,
      mimeType: mimetype,
      size,
    });
  } catch (error) {
    sendError(res, "Failed to upload file", 500);
  }
}
