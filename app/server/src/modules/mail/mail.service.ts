import nodemailer, { Transporter } from "nodemailer";

import { env } from "../../config/env.js";
import { logger } from "../../utils/logger.js";

import { otpTemplate } from "./mail.templates.js";
import { SendOtpMailOptions } from "./mail.types.js";

class MailService {
  private transporter: Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    if (
      !process.env.SMTP_HOST ||
      !process.env.SMTP_PORT ||
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS
    ) {
      logger.warn(
        "SMTP configuration not found. Emails will be logged to console.",
      );

      return;
    }

    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,

      port: Number(process.env.SMTP_PORT),

      secure: Number(process.env.SMTP_PORT) === 465,

      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendOtp({ to, otp, purpose }: SendOtpMailOptions): Promise<void> {
    const subject =
      purpose === "LOGIN"
        ? "Your Login Verification Code • Promise Jewels"
        : "Reset Your Password • Promise Jewels";

    if (!this.transporter) {
      logger.info("====================================");
      logger.info("[DEV OTP EMAIL]");
      logger.info(`TO      : ${to}`);
      logger.info(`PURPOSE : ${purpose}`);
      logger.info(`OTP     : ${otp}`);
      logger.info("====================================");

      return;
    }

    await this.transporter.sendMail({
      from: env.MAIL_FROM,

      to,

      subject,

      html: otpTemplate(otp, purpose),
    });
  }
}

export default new MailService();
