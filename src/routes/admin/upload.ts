import { Router } from "express";
import { upload } from "../../middleware/upload";
import { uploadFile } from "../../controllers/admin/uploadController";

const router = Router();

// POST /api/admin/upload
router.post("/", upload.single("file"), uploadFile);

export { router as adminUploadRouter };
