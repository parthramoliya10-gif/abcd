import { Router } from "express";

import brandController from "./brand.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { uploadBrandImages } from "../../middleware/upload.middleware.js";
import {
  createBrandSchema,
  reorderBrandsSchema,
  updateBrandSchema,
} from "./brand.validation.js";

// ---------------------------------------------------------------------------
// Public routes -> mounted at /api/v1/brands
// Used by the client website (Brands listing + Brand detail page)
// ---------------------------------------------------------------------------
const publicRouter = Router();

publicRouter.get("/", brandController.listPublic);
publicRouter.get("/:slug", brandController.getPublicBySlug);

// ---------------------------------------------------------------------------
// Admin routes -> mounted at /api/v1/admin/brands
// Everything below requires a valid logged-in session
// ---------------------------------------------------------------------------
const adminRouter = Router();

adminRouter.use(requireAuth);

adminRouter.get("/", brandController.listAdmin);
adminRouter.get("/options", brandController.listOptions);
adminRouter.get("/:id", brandController.getById);

adminRouter.post(
  "/",
  uploadBrandImages,
  validate(createBrandSchema),
  brandController.create,
);

adminRouter.put(
  "/:id",
  uploadBrandImages,
  validate(updateBrandSchema),
  brandController.update,
);

adminRouter.patch(
  "/reorder",
  validate(reorderBrandsSchema),
  brandController.reorder,
);

adminRouter.patch("/:id/status", brandController.toggleStatus);

adminRouter.delete("/:id/images/:imageId", brandController.deleteImage);
adminRouter.delete("/:id", brandController.remove);

export { adminRouter as brandAdminRoutes };
export default publicRouter;
