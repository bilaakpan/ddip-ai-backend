import { Request, Response, NextFunction } from "express";
import { z } from "zod";

/**
 * Zod request validation middleware.
 * Validates request body against a Zod schema.
 */
export function validate(schema: z.ZodType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors,
        });
        return;
      }

      // Replace body with parsed (and potentially transformed) data
      req.body = result.data;
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        error: "Invalid request data",
      });
    }
  };
}
