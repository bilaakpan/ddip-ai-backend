import { Router } from "express";
import {
  getContent,
  getContentBulk,
} from "../../controllers/public/contentController";

const router = Router();

// GET /api/content/bulk?keys=hero_title,about_text
router.get("/bulk", getContentBulk);

// GET /api/content/:key
router.get("/:key", getContent);

export { router as publicContentRouter };
