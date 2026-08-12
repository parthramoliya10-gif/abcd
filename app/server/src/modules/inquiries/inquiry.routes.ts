import { Router } from "express";

import inquiryController from "./inquiry.controller.js";

import { requireAuth } from "../../middleware/auth.middleware.js";
import { validate } from "../../middleware/validation.middleware.js";

import {
  createInquirySchema,
  inquiryIdSchema,
  inquiryQuerySchema,
  updateInquirySchema,
} from "./inquiry.validation.js";

const router = Router();

/**
 * =====================================
 * Public Routes
 * =====================================
 */

// POST /api/v1/inquiries/contact
router.post(
  "/contact",
  validate(createInquirySchema),
  inquiryController.createInquiry,
);

/**
 * =====================================
 * Admin Routes
 * =====================================
 */

router.use(requireAuth);

// GET /api/v1/inquiries
router.get(
  "/",
  validate(inquiryQuerySchema, "query"),
  inquiryController.listInquiries,
);

// GET /api/v1/inquiries/export
router.get(
  "/export",
  validate(inquiryQuerySchema, "query"),
  inquiryController.exportInquiries,
);

// GET /api/v1/inquiries/:id
router.get(
  "/:id",
  validate(inquiryIdSchema, "params"),
  inquiryController.getInquiryById,
);

// PATCH /api/v1/inquiries/:id/status
router.patch(
  "/:id/status",
  validate(inquiryIdSchema, "params"),
  validate(updateInquirySchema),
  inquiryController.updateInquiryStatus,
);

// DELETE /api/v1/inquiries/:id
router.delete(
  "/:id",
  validate(inquiryIdSchema, "params"),
  inquiryController.deleteInquiry,
);

export default router;