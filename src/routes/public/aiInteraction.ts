import { Router } from "express";
import { validate } from "../../middleware/validate";
import { formLimiter } from "../../middleware/rateLimiter";
import { submitAIInteraction } from "../../controllers/public/aiInteractionController";
import { z } from "zod";

const router = Router();

const aiInteractionSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  message: z.string().min(1, "Message is required"),
  category: z.string().optional(),
});

// POST /api/ai-interaction
router.post("/", formLimiter, validate(aiInteractionSchema), submitAIInteraction);

export { router as publicAiInteractionRouter };
