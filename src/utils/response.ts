import { Response } from "express";

/**
 * Standardized API response helpers.
 */

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200
): void {
  res.status(statusCode).json({
    success: true,
    data,
  });
}

export function sendCreated<T>(res: Response, data: T): void {
  sendSuccess(res, data, 201);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400
): void {
  res.status(statusCode).json({
    success: false,
    error: message,
  });
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number
): void {
  res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}
