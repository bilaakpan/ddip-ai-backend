import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

/**
 * Global error handling middleware.
 * Must be the last middleware registered.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error("Unhandled error:", err.message, err.stack);

  // Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    res.status(409).json({
      success: false,
      error: "Database constraint violation",
    });
    return;
  }

  if (err.name === "PrismaClientValidationError") {
    res.status(400).json({
      success: false,
      error: "Invalid data format",
    });
    return;
  }

  // Default 500
  res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
}
