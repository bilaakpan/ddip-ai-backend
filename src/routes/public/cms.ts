import { Router } from "express";
import {
  getPublicHeroSliders,
  getPublicFaqs,
  getPublicWorks,
  getPublicAiSolutions,
  getPublicAiSolutionBySlug,
  getPublicInfluencers,
  getPublicAutomations,
  getPublicUseCases,
  getPublicInsights,
  getPublicInsightBySlug,
  getPublicFilterOptions,
} from "../../controllers/public/cmsController";

const router = Router();

// GET /api/cms/hero-sliders
router.get("/hero-sliders", getPublicHeroSliders);

// GET /api/cms/faqs?page_slug=main
router.get("/faqs", getPublicFaqs);

// GET /api/cms/works?highlighted=true
router.get("/works", getPublicWorks);

// GET /api/cms/ai-solutions
router.get("/ai-solutions", getPublicAiSolutions);

// GET /api/cms/ai-solutions/:slug
router.get("/ai-solutions/:slug", getPublicAiSolutionBySlug);

// GET /api/cms/influencers?category=Influencer&region=Middle+East
router.get("/influencers", getPublicInfluencers);

// GET /api/cms/automations?highlighted=true
router.get("/automations", getPublicAutomations);

// GET /api/cms/use-cases?page_slug=ai-influencer
router.get("/use-cases", getPublicUseCases);

// GET /api/cms/insights?page=1&limit=15
router.get("/insights", getPublicInsights);

// GET /api/cms/insights/:slug
router.get("/insights/:slug", getPublicInsightBySlug);

// GET /api/cms/filter-options?group=influencer_region
router.get("/filter-options", getPublicFilterOptions);

export { router as publicCmsRouter };
