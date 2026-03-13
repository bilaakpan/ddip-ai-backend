import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendSuccess, sendCreated, sendError } from "../../utils/response";
import { AuthenticatedRequest } from "../../middleware/auth";
import { getParam, getQueryParam } from "../../utils/params";

/** GET /api/admin/faqs?page_slug=main */
export async function listFaqs(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const pageSlug = getQueryParam(req, "page_slug");

    const faqs = await prisma.faq.findMany({
      where: pageSlug ? { pageSlug } : undefined,
      orderBy: [{ pageSlug: "asc" }, { sortOrder: "asc" }],
    });

    sendSuccess(res, faqs);
  } catch (error) {
    sendError(res, "Failed to fetch FAQs", 500);
  }
}

/** GET /api/admin/faqs/:id */
export async function getFaq(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const faq = await prisma.faq.findUnique({
      where: { id: getParam(req, "id")! },
    });

    if (!faq) {
      sendError(res, "FAQ not found", 404);
      return;
    }

    sendSuccess(res, faq);
  } catch (error) {
    sendError(res, "Failed to fetch FAQ", 500);
  }
}

/** POST /api/admin/faqs */
export async function createFaq(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { pageSlug, question, answer, sortOrder } = req.body;

    if (!pageSlug || !question || !answer) {
      sendError(res, "pageSlug, question, and answer are required", 400);
      return;
    }

    const faq = await prisma.faq.create({
      data: {
        pageSlug,
        question,
        answer,
        sortOrder: sortOrder ?? 0,
      },
    });

    sendCreated(res, faq);
  } catch (error) {
    sendError(res, "Failed to create FAQ", 500);
  }
}

/** PATCH /api/admin/faqs/:id */
export async function updateFaq(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const id = getParam(req, "id")!;
    const { pageSlug, question, answer, sortOrder } = req.body;

    const existing = await prisma.faq.findUnique({ where: { id } });
    if (!existing) {
      sendError(res, "FAQ not found", 404);
      return;
    }

    const faq = await prisma.faq.update({
      where: { id },
      data: {
        ...(pageSlug !== undefined && { pageSlug }),
        ...(question !== undefined && { question }),
        ...(answer !== undefined && { answer }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    });

    sendSuccess(res, faq);
  } catch (error) {
    sendError(res, "Failed to update FAQ", 500);
  }
}

/** DELETE /api/admin/faqs/:id */
export async function deleteFaq(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const id = getParam(req, "id")!;

    const existing = await prisma.faq.findUnique({ where: { id } });
    if (!existing) {
      sendError(res, "FAQ not found", 404);
      return;
    }

    await prisma.faq.delete({ where: { id } });
    sendSuccess(res, { deleted: true });
  } catch (error) {
    sendError(res, "Failed to delete FAQ", 500);
  }
}

/** PATCH /api/admin/faqs/reorder */
export async function reorderFaqs(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { items } = req.body as { items: { id: string; sortOrder: number }[] };

    if (!Array.isArray(items)) {
      sendError(res, "items must be an array of { id, sortOrder }", 400);
      return;
    }

    await prisma.$transaction(
      items.map((item) =>
        prisma.faq.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    );

    sendSuccess(res, { reordered: true });
  } catch (error) {
    sendError(res, "Failed to reorder FAQs", 500);
  }
}
