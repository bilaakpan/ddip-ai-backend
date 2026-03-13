import { Request, Response } from "express";
import { prisma } from "../../config/database";
import { sendSuccess, sendPaginated, sendError } from "../../utils/response";
import { parsePagination } from "../../utils/pagination";
import { getParam, getQueryParam } from "../../utils/params";

/** GET /api/admin/projects */
export async function listProjects(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { page, limit, skip } = parsePagination(req.query as Record<string, string>);
    const status = getQueryParam(req, "status");
    const projectType = getQueryParam(req, "projectType");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (projectType) where.projectType = projectType;

    const [projects, total] = await Promise.all([
      prisma.projectSubmission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.projectSubmission.count({ where }),
    ]);

    sendPaginated(res, projects, total, page, limit);
  } catch (error) {
    sendError(res, "Failed to fetch projects", 500);
  }
}

/** GET /api/admin/projects/:id */
export async function getProject(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const project = await prisma.projectSubmission.findUnique({
      where: { id: getParam(req, "id")! },
    });

    if (!project) {
      sendError(res, "Project not found", 404);
      return;
    }

    sendSuccess(res, project);
  } catch (error) {
    sendError(res, "Failed to fetch project", 500);
  }
}

/** PATCH /api/admin/projects/:id */
export async function updateProject(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { status, internalNotes } = req.body;

    const project = await prisma.projectSubmission.update({
      where: { id: getParam(req, "id")! },
      data: {
        ...(status && { status }),
        ...(internalNotes !== undefined && { internalNotes }),
      },
    });

    sendSuccess(res, project);
  } catch (error) {
    sendError(res, "Failed to update project", 500);
  }
}

/** DELETE /api/admin/projects/:id */
export async function deleteProject(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await prisma.projectSubmission.delete({
      where: { id: getParam(req, "id")! },
    });

    sendSuccess(res, { deleted: true });
  } catch (error) {
    sendError(res, "Failed to delete project", 500);
  }
}
