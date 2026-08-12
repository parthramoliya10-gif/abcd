import { Router } from "express";

import settingsController from "./settings.controller.js";
import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";
import { changePasswordSchema, updateSettingsSchema } from "./settings.validation.js";

// This whole module is mounted once at /api/v1/settings in routes/index.ts.
//
// - GET /api/v1/settings/public   -> no auth, used by the public website
//                                     (Footer.jsx). Returns raw DB field
//                                     names (siteName, phone, email, ...).
// - GET  /api/v1/settings         -> admin only, matches settings.service.js
// - PUT  /api/v1/settings         -> admin only, matches settings.service.js
// - PUT  /api/v1/settings/password-> admin only, matches settings.service.js
//
// IMPORTANT: the /public route is registered BEFORE router.use(requireAuth)
// below, so it is the only route on this router that skips auth. Every
// route added after that line requires a valid session.
const router = Router();

router.get("/public", settingsController.getPublic);

router.use(requireAuth);

router.get("/", settingsController.getAdmin);

router.put("/", validate(updateSettingsSchema), settingsController.updateAdmin);

router.put(
  "/password",
  validate(changePasswordSchema),
  settingsController.changePassword,
);

export default router;
