import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendSuccess, sendCreated, sendError } from "../../utils/response";
import { AuthenticatedRequest } from "../../middleware/auth";
import { getParam, getQueryParam } from "../../utils/params";

/** GET /api/admin/filter-options?group=influencer_region */
export async function listFilterOptions(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const group = getQueryParam(req, "group");

    const options = await prisma.filterOption.findMany({
      where: group ? { group } : undefined,
      orderBy: [{ group: "asc" }, { sortOrder: "asc" }, { value: "asc" }],
    });

    sendSuccess(res, options);
  } catch (error) {
    sendError(res, "Failed to fetch filter options", 500);
  }
}

/** POST /api/admin/filter-options */
export async function createFilterOption(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { group, value, sortOrder } = req.body;

    if (!group || !value) {
      sendError(res, "group and value are required", 400);
      return;
    }

    const option = await prisma.filterOption.create({
      data: { group, value, sortOrder: sortOrder ?? 0 },
    });

    sendCreated(res, option);
  } catch (error: any) {
    if (error?.code === "P2002") {
      sendError(res, "This option already exists in this group", 409);
      return;
    }
    sendError(res, "Failed to create filter option", 500);
  }
}

/** DELETE /api/admin/filter-options/:id */
export async function deleteFilterOption(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const id = getParam(req, "id")!;

    const existing = await prisma.filterOption.findUnique({ where: { id } });
    if (!existing) {
      sendError(res, "Filter option not found", 404);
      return;
    }

    await prisma.filterOption.delete({ where: { id } });
    sendSuccess(res, { deleted: true });
  } catch (error) {
    sendError(res, "Failed to delete filter option", 500);
  }
}
