import { Router } from "express";
import { publicAiInteractionRouter } from "./public/aiInteraction";
import { publicProjectRouter } from "./public/project";
import { publicContactRouter } from "./public/contact";
import { publicContentRouter } from "./public/content";
import { publicCmsRouter } from "./public/cms";
import { adminAuthRouter } from "./admin/auth";
import { adminAiInteractionRouter } from "./admin/aiInteractions";
import { adminProjectRouter } from "./admin/projects";
import { adminContactRouter } from "./admin/contacts";
import { adminUserRouter } from "./admin/users";
import { adminContentRouter } from "./admin/content";
import { adminHeroSliderRouter } from "./admin/heroSliders";
import { adminFaqRouter } from "./admin/faqs";
import { adminWorkRouter } from "./admin/works";
import { adminTagRouter } from "./admin/tags";
import { adminFilterOptionRouter } from "./admin/filterOptions";
import { adminInfluencerRouter } from "./admin/influencers";
import { adminAiSolutionRouter } from "./admin/aiSolutions";
import { adminAutomationRouter } from "./admin/automations";
import { adminUseCaseRouter } from "./admin/useCases";
import { adminInsightRouter } from "./admin/insights";
import { authenticate } from "../middleware/auth";

const router = Router();

// ─── Public Routes ───
router.use("/ai-interaction", publicAiInteractionRouter);
router.use("/project", publicProjectRouter);
router.use("/contact", publicContactRouter);
router.use("/content", publicContentRouter);
router.use("/cms", publicCmsRouter);

// ─── Admin Routes (all require authentication) ───
router.use("/admin/auth", adminAuthRouter);
router.use("/admin/ai-interactions", authenticate, adminAiInteractionRouter);
router.use("/admin/projects", authenticate, adminProjectRouter);
router.use("/admin/contacts", authenticate, adminContactRouter);
router.use("/admin/users", authenticate, adminUserRouter);
router.use("/admin/content", authenticate, adminContentRouter);
router.use("/admin/hero-sliders", authenticate, adminHeroSliderRouter);
router.use("/admin/faqs", authenticate, adminFaqRouter);
router.use("/admin/works", authenticate, adminWorkRouter);
router.use("/admin/tags", authenticate, adminTagRouter);
router.use("/admin/filter-options", authenticate, adminFilterOptionRouter);
router.use("/admin/influencers", authenticate, adminInfluencerRouter);
router.use("/admin/ai-solutions", authenticate, adminAiSolutionRouter);
router.use("/admin/automations", authenticate, adminAutomationRouter);
router.use("/admin/use-cases", authenticate, adminUseCaseRouter);
router.use("/admin/insights", authenticate, adminInsightRouter);

export { router as routes };
