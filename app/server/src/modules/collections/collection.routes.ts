import { Router } from "express";

import collectionController from "./collection.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { uploadCollectionImages } from "../../middleware/upload.middleware.js";
import {
  createCollectionSchema,
  reorderCollectionsSchema,
  updateCollectionSchema,
} from "./collection.validation.js";

// ---------------------------------------------------------------------------
// Public routes -> mounted at /api/v1/collections
// Used by the client website (Collections listing + Collection detail page)
// Supports ?brandId=&category=&featured= filters
// ---------------------------------------------------------------------------
const publicRouter = Router();

publicRouter.get("/", collectionController.listPublic);
publicRouter.get("/:slug", collectionController.getPublicBySlug);

// ---------------------------------------------------------------------------
// Admin routes -> mounted at /api/v1/admin/collections
// Everything below requires a valid logged-in session
// ---------------------------------------------------------------------------
const adminRouter = Router();

adminRouter.use(requireAuth);

adminRouter.get("/", collectionController.listAdmin);
adminRouter.get("/:id", collectionController.getById);

adminRouter.post(
  "/",
  uploadCollectionImages,
  validate(createCollectionSchema),
  collectionController.create,
);

adminRouter.put(
  "/:id",
  uploadCollectionImages,
  validate(updateCollectionSchema),
  collectionController.update,
);

adminRouter.patch(
  "/reorder",
  validate(reorderCollectionsSchema),
  collectionController.reorder,
);

adminRouter.patch("/:id/status", collectionController.toggleStatus);
adminRouter.patch("/:id/featured", collectionController.toggleFeatured);
adminRouter.patch("/:id/images/:imageId/thumbnail", collectionController.setThumbnail);

adminRouter.delete("/:id/images/:imageId", collectionController.deleteImage);
adminRouter.delete("/:id", collectionController.remove);

export { adminRouter as collectionAdminRoutes };
export default publicRouter;
