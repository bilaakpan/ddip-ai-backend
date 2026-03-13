import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendSuccess, sendPaginated, sendError } from "../../utils/response";
import { parsePagination } from "../../utils/pagination";
import { getParam, getQueryParam } from "../../utils/params";

/** GET /api/admin/contacts */
export async function listContacts(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { page, limit, skip } = parsePagination(req.query as Record<string, string>);
    const status = getQueryParam(req, "status");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const [contacts, total] = await Promise.all([
      prisma.contactSubmission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.contactSubmission.count({ where }),
    ]);

    sendPaginated(res, contacts, total, page, limit);
  } catch (error) {
    sendError(res, "Failed to fetch contacts", 500);
  }
}

/** GET /api/admin/contacts/:id */
export async function getContact(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const contact = await prisma.contactSubmission.findUnique({
      where: { id: getParam(req, "id")! },
    });

    if (!contact) {
      sendError(res, "Contact not found", 404);
      return;
    }

    sendSuccess(res, contact);
  } catch (error) {
    sendError(res, "Failed to fetch contact", 500);
  }
}

/** DELETE /api/admin/contacts/:id */
export async function deleteContact(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await prisma.contactSubmission.delete({
      where: { id: getParam(req, "id")! },
    });

    sendSuccess(res, { deleted: true });
  } catch (error) {
    sendError(res, "Failed to delete contact", 500);
  }
}
