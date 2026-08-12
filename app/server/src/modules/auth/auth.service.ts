import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";
import { ApiError } from "../../utils/ApiError.js";
import { AUTH_MESSAGES } from "./auth.constants.js";
import { OtpPurpose, User } from "@prisma/client";
import authRepository from "./auth.repository.js";
import mailService from "../mail/mail.service.js";
import { env } from "../../config/env.js";
import {
  hashPassword,
  hashValue,
  comparePassword,
} from "../../utils/password.js";
import { generateOtp } from "../../utils/otp.js";

class AuthService {
  async login(email: string, password: string): Promise<void> {
    const user = await authRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(401, AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    if (!user.isActive) {
      throw new ApiError(403, AUTH_MESSAGES.ACCOUNT_DISABLED);
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(401, AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    await this.issueOtp(user, OtpPurpose.LOGIN);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await authRepository.findByEmail(email);

    /**
     * Security:
     * Same response denge chahe email exist kare ya nahi.
     * Email enumeration avoid hota hai.
     */
    if (!user) {
      return;
    }

    await this.issueOtp(user, OtpPurpose.FORGOT_PASSWORD);
  }

  private async issueOtp(
    user: Pick<User, "id" | "email">,
    purpose: OtpPurpose,
  ): Promise<void> {
    const otp = generateOtp();

    const hashedOtp = await hashValue(otp);

    const expiry = new Date(Date.now() + env.OTP_EXPIRY_MINUTES * 60 * 1000);

    await authRepository.updateOtp(user.id, hashedOtp, expiry, purpose);

    await mailService.sendOtp({
      to: user.email,
      otp,
      purpose: purpose === OtpPurpose.LOGIN ? "LOGIN" : "FORGOT_PASSWORD",
    });
  }

  private async verifyUserOtp(email: string, otp: string, purpose: OtpPurpose) {
    const user = await authRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(401, AUTH_MESSAGES.INVALID_OTP);
    }

    if (!user.otpCode || !user.otpExpiresAt || !user.otpPurpose) {
      throw new ApiError(401, AUTH_MESSAGES.INVALID_OTP);
    }

    if (user.otpPurpose !== purpose) {
      throw new ApiError(401, AUTH_MESSAGES.INVALID_OTP);
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      throw new ApiError(401, AUTH_MESSAGES.OTP_EXPIRED);
    }

    const isOtpValid = await comparePassword(otp, user.otpCode);

    if (!isOtpValid) {
      throw new ApiError(401, AUTH_MESSAGES.INVALID_OTP);
    }

    return user;
  }

  async verifyOtp(email: string, otp: string, purpose: OtpPurpose) {
    const user = await this.verifyUserOtp(email, otp, purpose);

    const accessToken = generateAccessToken(user.id);

    const refreshToken = generateRefreshToken(user.id);

    const hashedRefreshToken = await hashValue(refreshToken);

    await authRepository.updateLoginSuccess(user.id, hashedRefreshToken);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },

      accessToken,

      refreshToken,
    };
  }

  async resetPassword(
    email: string,
    otp: string,
    newPassword: string,
  ): Promise<void> {
    const user = await authRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(401, AUTH_MESSAGES.INVALID_OTP);
    }

    if (!user.otpCode || !user.otpExpiresAt || !user.otpPurpose) {
      throw new ApiError(401, AUTH_MESSAGES.INVALID_OTP);
    }

    if (user.otpPurpose !== OtpPurpose.FORGOT_PASSWORD) {
      throw new ApiError(401, AUTH_MESSAGES.INVALID_OTP);
    }

    if (user.otpExpiresAt.getTime() < Date.now()) {
      throw new ApiError(401, AUTH_MESSAGES.OTP_EXPIRED);
    }

    const isOtpValid = await comparePassword(otp, user.otpCode);

    if (!isOtpValid) {
      throw new ApiError(401, AUTH_MESSAGES.INVALID_OTP);
    }

    const hashedPassword = await hashPassword(newPassword);

    await authRepository.updatePassword(user.id, hashedPassword);

    await authRepository.clearOtp(user.id);

    await authRepository.clearRefreshToken(user.id);
  }

  async me(userId: string) {
    const user = await authRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, AUTH_MESSAGES.USER_NOT_FOUND);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
    };
  }

  async refresh(refreshToken: string) {
    let payload;

    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new ApiError(401, AUTH_MESSAGES.UNAUTHORIZED);
    }

    const user = await authRepository.findById(payload.userId);

    if (!user || !user.isActive) {
      throw new ApiError(401, AUTH_MESSAGES.UNAUTHORIZED);
    }

    if (!user.refreshTokenHash) {
      throw new ApiError(401, AUTH_MESSAGES.UNAUTHORIZED);
    }

    const isValid = await comparePassword(refreshToken, user.refreshTokenHash);

    if (!isValid) {
      throw new ApiError(401, AUTH_MESSAGES.UNAUTHORIZED);
    }

    const newAccessToken = generateAccessToken(user.id);

    const newRefreshToken = generateRefreshToken(user.id);

    const hashedRefreshToken = await hashValue(newRefreshToken);

    await authRepository.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string): Promise<void> {
    await authRepository.clearRefreshToken(userId);
  }
}

export default new AuthService();
