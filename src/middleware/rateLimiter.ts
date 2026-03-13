import rateLimit from "express-rate-limit";
import { env } from "../config/env";

/**
 * General rate limiter (100 requests per 15 minutes).
 */
export const generalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests, please try again later.",
  },
});

/**
 * Strict rate limiter for form submissions (10 per 15 minutes).
 */
export const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many submissions. Please try again later.",
  },
});

/**
 * Auth rate limiter (5 login attempts per 15 minutes).
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many login attempts. Please try again later.",
  },
});
