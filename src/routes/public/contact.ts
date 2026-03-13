import { Router } from "express";
import { validate } from "../../middleware/validate";
import { formLimiter } from "../../middleware/rateLimiter";
import { submitContact } from "../../controllers/public/contactController";
import { z } from "zod";

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// POST /api/contact/submit
router.post("/submit", formLimiter, validate(contactSchema), submitContact);

export { router as publicContactRouter };
