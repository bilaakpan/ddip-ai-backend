import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendSuccess, sendCreated, sendError } from "../../utils/response";
import { AuthenticatedRequest } from "../../middleware/auth";
import { getParam } from "../../utils/params";

/** GET /api/admin/automations */
export async function listAutomations(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const automations = await prisma.automation.findMany({
      orderBy: { sortOrder: "asc" },
      include: { icons: { include: { icon: true } } },
    });
    sendSuccess(res, automations);
  } catch (error) {
    sendError(res, "Failed to fetch automations", 500);
  }
}

/** GET /api/admin/automations/:id */
export async function getAutomation(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const automation = await prisma.automation.findUnique({
      where: { id: getParam(req, "id")! },
      include: { icons: { include: { icon: true } } },
    });

    if (!automation) {
      sendError(res, "Automation not found", 404);
      return;
    }

    sendSuccess(res, automation);
  } catch (error) {
    sendError(res, "Failed to fetch automation", 500);
  }
}

/** POST /api/admin/automations */
export async function createAutomation(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { title, isHighlighted, sortOrder, iconIds } = req.body;

    if (!title) {
      sendError(res, "title is required", 400);
      return;
    }

    const automation = await prisma.automation.create({
      data: {
        title,
        isHighlighted: isHighlighted ?? false,
        sortOrder: sortOrder ?? 0,
        ...(iconIds?.length && {
          icons: {
            create: iconIds.map((iconId: string) => ({ iconId })),
          },
        }),
      },
      include: { icons: { include: { icon: true } } },
    });

    sendCreated(res, automation);
  } catch (error) {
    sendError(res, "Failed to create automation", 500);
  }
}

/** PATCH /api/admin/automations/:id */
export async function updateAutomation(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const id = getParam(req, "id")!;
    const { title, isHighlighted, sortOrder, iconIds } = req.body;

    const existing = await prisma.automation.findUnique({ where: { id } });
    if (!existing) {
      sendError(res, "Automation not found", 404);
      return;
    }

    // If iconIds provided, replace all icon mappings
    if (iconIds !== undefined) {
      await prisma.automationIconMap.deleteMany({ where: { automationId: id } });
    }

    const automation = await prisma.automation.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(isHighlighted !== undefined && { isHighlighted }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(iconIds !== undefined && {
          icons: {
            create: iconIds.map((iconId: string) => ({ iconId })),
          },
        }),
      },
      include: { icons: { include: { icon: true } } },
    });

    sendSuccess(res, automation);
  } catch (error) {
    sendError(res, "Failed to update automation", 500);
  }
}

/** DELETE /api/admin/automations/:id */
export async function deleteAutomation(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const id = getParam(req, "id")!;

    const existing = await prisma.automation.findUnique({ where: { id } });
    if (!existing) {
      sendError(res, "Automation not found", 404);
      return;
    }

    await prisma.automation.delete({ where: { id } });
    sendSuccess(res, { deleted: true });
  } catch (error) {
    sendError(res, "Failed to delete automation", 500);
  }
}

// ─── Automation Icons ───

/** GET /api/admin/automation-icons */
export async function listAutomationIcons(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const icons = await prisma.automationIcon.findMany({
      orderBy: { name: "asc" },
    });
    sendSuccess(res, icons);
  } catch (error) {
    sendError(res, "Failed to fetch automation icons", 500);
  }
}

/** POST /api/admin/automation-icons */
export async function createAutomationIcon(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const { name, iconUrl } = req.body;

    if (!name || !iconUrl) {
      sendError(res, "name and iconUrl are required", 400);
      return;
    }

    const icon = await prisma.automationIcon.create({
      data: { name, iconUrl },
    });

    sendCreated(res, icon);
  } catch (error) {
    sendError(res, "Failed to create automation icon", 500);
  }
}

/** DELETE /api/admin/automation-icons/:id */
export async function deleteAutomationIcon(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const id = getParam(req, "id")!;

    const existing = await prisma.automationIcon.findUnique({ where: { id } });
    if (!existing) {
      sendError(res, "Automation icon not found", 404);
      return;
    }

    await prisma.automationIcon.delete({ where: { id } });
    sendSuccess(res, { deleted: true });
  } catch (error) {
    sendError(res, "Failed to delete automation icon", 500);
  }
}
