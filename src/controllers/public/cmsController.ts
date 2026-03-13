import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendSuccess, sendPaginated, sendError } from "../../utils/response";
import { getQueryParam } from "../../utils/params";
import { parsePagination } from "../../utils/pagination";

/** GET /api/cms/hero-sliders — Active sliders only, ordered */
export async function getPublicHeroSliders(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const sliders = await prisma.heroSlider.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    sendSuccess(res, sliders);
  } catch (error) {
    sendError(res, "Failed to fetch hero sliders", 500);
  }
}

/** GET /api/cms/faqs?page_slug=main — FAQs for a specific page */
export async function getPublicFaqs(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const pageSlug = getQueryParam(req, "page_slug");

    if (!pageSlug) {
      sendError(res, "page_slug query parameter is required", 400);
      return;
    }

    const faqs = await prisma.faq.findMany({
      where: { pageSlug },
      orderBy: { sortOrder: "asc" },
    });
    sendSuccess(res, faqs);
  } catch (error) {
    sendError(res, "Failed to fetch FAQs", 500);
  }
}

/** GET /api/cms/works?highlighted=true — Works, optionally filtered by highlight */
export async function getPublicWorks(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const highlighted = getQueryParam(req, "highlighted");

    const works = await prisma.work.findMany({
      where: highlighted === "true" ? { isHighlighted: true } : undefined,
      orderBy: { sortOrder: "asc" },
      include: { tags: { include: { tag: true } } },
    });
    sendSuccess(res, works);
  } catch (error) {
    sendError(res, "Failed to fetch works", 500);
  }
}

/** GET /api/cms/ai-solutions — All AI solutions, ordered */
export async function getPublicAiSolutions(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const solutions = await prisma.aiSolution.findMany({
      orderBy: { sortOrder: "asc" },
      include: { tags: { include: { tag: true } } },
    });
    sendSuccess(res, solutions);
  } catch (error) {
    sendError(res, "Failed to fetch AI solutions", 500);
  }
}

/** GET /api/cms/ai-solutions/:slug — Single AI solution by slug */
export async function getPublicAiSolutionBySlug(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const slug = req.params.slug as string;
    const solution = await prisma.aiSolution.findUnique({
      where: { slug },
      include: { tags: { include: { tag: true } } },
    });

    if (!solution) {
      sendError(res, "AI solution not found", 404);
      return;
    }

    sendSuccess(res, solution);
  } catch (error) {
    sendError(res, "Failed to fetch AI solution", 500);
  }
}

/** GET /api/cms/influencers?category=Influencer&region=Middle+East */
export async function getPublicInfluencers(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const category = getQueryParam(req, "category");
    const region = getQueryParam(req, "region");
    const homepage = getQueryParam(req, "homepage");

    const influencers = await prisma.influencer.findMany({
      where: {
        ...(category && { category }),
        ...(region && { region }),
        ...(homepage === "true" && { showOnHomepage: true }),
      },
      orderBy: { sortOrder: "asc" },
    });
    sendSuccess(res, influencers);
  } catch (error) {
    sendError(res, "Failed to fetch influencers", 500);
  }
}

/** GET /api/cms/automations?highlighted=true */
export async function getPublicAutomations(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const highlighted = getQueryParam(req, "highlighted");

    const automations = await prisma.automation.findMany({
      where: highlighted === "true" ? { isHighlighted: true } : undefined,
      orderBy: { sortOrder: "asc" },
      include: { icons: { include: { icon: true } } },
    });
    sendSuccess(res, automations);
  } catch (error) {
    sendError(res, "Failed to fetch automations", 500);
  }
}

/** GET /api/cms/use-cases?page_slug=ai-influencer */
export async function getPublicUseCases(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const pageSlug = getQueryParam(req, "page_slug");

    if (!pageSlug) {
      sendError(res, "page_slug query parameter is required", 400);
      return;
    }

    const useCases = await prisma.useCase.findMany({
      where: { pageSlug },
      orderBy: { sortOrder: "asc" },
      include: { tags: { include: { tag: true } } },
    });
    sendSuccess(res, useCases);
  } catch (error) {
    sendError(res, "Failed to fetch use cases", 500);
  }
}

/** GET /api/cms/insights?page=1&limit=15 — Paginated blog posts */
export async function getPublicInsights(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { page, limit, skip } = parsePagination(req.query as { page?: string; limit?: string });
    const category = getQueryParam(req, "category");

    const where = category ? { category } : {};

    const [insights, total] = await Promise.all([
      prisma.insight.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.insight.count({ where }),
    ]);

    sendPaginated(res, insights, total, page, limit);
  } catch (error) {
    sendError(res, "Failed to fetch insights", 500);
  }
}

/** GET /api/cms/insights/:slug — Single blog post by slug */
export async function getPublicInsightBySlug(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const slug = req.params.slug as string;
    const insight = await prisma.insight.findUnique({
      where: { slug },
    });

    if (!insight) {
      sendError(res, "Insight not found", 404);
      return;
    }

    sendSuccess(res, insight);
  } catch (error) {
    sendError(res, "Failed to fetch insight", 500);
  }
}

/** GET /api/cms/filter-options?group=influencer_region */
export async function getPublicFilterOptions(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const group = getQueryParam(req, "group");

    if (!group) {
      sendError(res, "group query parameter is required", 400);
      return;
    }

    const options = await prisma.filterOption.findMany({
      where: { group },
      orderBy: { sortOrder: "asc" },
    });
    sendSuccess(res, options);
  } catch (error) {
    sendError(res, "Failed to fetch filter options", 500);
  }
}
