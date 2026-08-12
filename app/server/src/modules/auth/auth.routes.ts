import { Router } from "express";

import authController from "./auth.controller.js";
import { validate } from "../../middleware/validation.middleware.js";
import { forgotPasswordSchema, loginSchema, verifyOtpSchema,resetPasswordSchema } from "./auth.validation.js";
import { authenticate } from "../../middleware/auth.middleware.js";
const router = Router();

router.post("/login", validate(loginSchema), authController.login);

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);

router.post("/verify-otp", validate(verifyOtpSchema), authController.verifyOtp);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  authController.resetPassword,
);

router.get("/me", authenticate, authController.me);

router.post("/refresh", authController.refresh);

router.post("/logout", authenticate, authController.logout);

export default router;
