import { Request } from "express";

/**
 * Safely extract a route parameter as a string.
 * Express v5 types params as `string | string[]`.
 */
export function getParam(req: Request, name: string): string | undefined {
  const value = req.params[name];
  if (Array.isArray(value)) return value[0];
  return value;
}

/**
 * Extract route param with required check. Returns undefined if param is not present,
 * which lets the caller handle 400 response.
 */
export function requireParam(req: Request, name: string): string {
  const value = getParam(req, name);
  if (!value) throw new Error(`Missing required parameter: ${name}`);
  return value;
}

/**
 * Safely extract query parameter as a string.
 */
export function getQueryParam(req: Request, name: string): string | undefined {
  const value = req.query[name];
  if (Array.isArray(value)) return value[0] as string;
  return value as string | undefined;
}
