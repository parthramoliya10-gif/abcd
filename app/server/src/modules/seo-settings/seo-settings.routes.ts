import { Router } from "express";

import seoSettingsController from "./seo-settings.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";
// import { validate } from "../../middleware/validate.middleware.js";
// import { updateSeoSettingsSchema } from "./seo-settings.validation.js";

const router = Router();

router.use(authenticate);

router.get("/", seoSettingsController.get);

router.patch(
  "/",
  // validate(updateSeoSettingsSchema),
  seoSettingsController.update,
);

export default router;
