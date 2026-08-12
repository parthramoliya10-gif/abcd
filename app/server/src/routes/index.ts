import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import exhibitionRoutes from "../modules/exhibitions/exhibition.routes.js";
import seoRoutes from "../modules/seo/seo.routes.js";
import seoPublicRoutes from "../modules/seo/public/seo.public.routes.js";
import seoSettingsRoutes from "../modules/seo-settings/seo-settings.routes.js";
import brandRoutes, {brandAdminRoutes} from "../modules/brands/brand.routes.js";
import collectionRoutes, {collectionAdminRoutes} from "../modules/collections/collection.routes.js";
import { authenticate } from "../middleware/auth.middleware.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
import inquiryRoutes from "../modules/inquiries/inquiry.routes.js";
import settingsRoutes from "../modules/settings/settings.routes.js";

const router = Router();
//public routes
router.use("/", seoPublicRoutes);
router.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Promise Jewels API",
  });
});
//protected routes
router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/exhibitions", exhibitionRoutes);
router.use("/seo", seoRoutes);
router.use("/brands", brandRoutes);
router.use("/admin/brands", brandAdminRoutes);
router.use("/collections", collectionRoutes);
router.use("/admin/collections", collectionAdminRoutes);
router.use("/seo-settings",authenticate ,seoSettingsRoutes);
router.use("/inquiries", inquiryRoutes);
router.use("/settings", settingsRoutes);
export default router;
