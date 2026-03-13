import { Router } from "express";
import { validate } from "../../middleware/validate";
import { formLimiter } from "../../middleware/rateLimiter";
import { submitProject } from "../../controllers/public/projectController";
import { z } from "zod";

const router = Router();

const projectSubmissionSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  company: z.string().optional(),
  title: z.string().optional(),
  projectType: z.string().min(1, "Project type is required"),
  projectDescription: z.string().optional(),
  influencerDetails: z.string().optional(), // JSON string
  styleReference: z.string().optional(),
  briefDetails: z.string().optional(),
});

// POST /api/project/submit
router.post("/submit", formLimiter, validate(projectSubmissionSchema), submitProject);

export { router as publicProjectRouter };
