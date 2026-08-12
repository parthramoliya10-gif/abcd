import settingsRepository from "./settings.repository.js";
import authRepository from "../auth/auth.repository.js";
import { ApiError } from "../../utils/ApiError.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import { SETTINGS_MESSAGES } from "./settings.constants.js";
import {
  AdminSettingsDto,
  AdminSettingsView,
  ChangePasswordDto,
  PublicSettingsView,
} from "./settings.types.js";

// Prisma's settings row type (only the fields we touch here).
type SettingsRow = {
  siteName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  youtubeUrl: string | null;
};

class SettingsService {
  // ---- Public (Footer.jsx) ----
  // DB column names already match what the footer expects 1:1, so this
  // is close to a passthrough — just guarding against nulls.

  async getPublic(): Promise<PublicSettingsView> {
    const row = (await settingsRepository.getOrCreate()) as SettingsRow;
    return this.toPublicShape(row);
  }

  // ---- Admin (SettingsPage.jsx) ----

  async getAdmin(): Promise<AdminSettingsView> {
    const row = (await settingsRepository.getOrCreate()) as SettingsRow;
    return this.toAdminShape(row);
  }

  async updateAdmin(input: AdminSettingsDto): Promise<AdminSettingsView> {
    const data: Record<string, unknown> = {};

    if (input.site_name !== undefined) data.siteName = input.site_name;
    if (input.contact_email !== undefined) data.email = input.contact_email;
    if (input.contact_phone !== undefined) data.phone = input.contact_phone;
    if (input.address !== undefined) data.address = input.address;

    if (input.social?.instagram !== undefined) data.instagramUrl = input.social.instagram;
    if (input.social?.facebook !== undefined) data.facebookUrl = input.social.facebook;
    if (input.social?.linkedin !== undefined) data.linkedinUrl = input.social.linkedin;

    const updated = (await settingsRepository.update(data)) as SettingsRow;
    return this.toAdminShape(updated);
  }

  async changePassword(userId: string, input: ChangePasswordDto): Promise<void> {
    const user = await authRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const isCurrentValid = await comparePassword(input.currentPassword, user.password);

    if (!isCurrentValid) {
      throw new ApiError(400, SETTINGS_MESSAGES.INVALID_CURRENT_PASSWORD);
    }

    const isSameAsOld = await comparePassword(input.newPassword, user.password);

    if (isSameAsOld) {
      throw new ApiError(400, SETTINGS_MESSAGES.SAME_AS_OLD_PASSWORD);
    }

    const hashed = await hashPassword(input.newPassword);
    await authRepository.updatePassword(userId, hashed);
  }

  // ---- Internal shape mappers ----

  private toAdminShape(row: SettingsRow): AdminSettingsView {
    return {
      site_name: row.siteName ?? "",
      contact_email: row.email ?? "",
      contact_phone: row.phone ?? "",
      address: row.address ?? "",
      social: {
        instagram: row.instagramUrl ?? "",
        facebook: row.facebookUrl ?? "",
        linkedin: row.linkedinUrl ?? "",
      },
    };
  }

  private toPublicShape(row: SettingsRow): PublicSettingsView {
    return {
      siteName: row.siteName ?? "",
      logoUrl: row.logoUrl,
      faviconUrl: row.faviconUrl,
      email: row.email ?? "",
      phone: row.phone ?? "",
      address: row.address ?? "",
      facebookUrl: row.facebookUrl ?? "",
      instagramUrl: row.instagramUrl ?? "",
      linkedinUrl: row.linkedinUrl ?? "",
      youtubeUrl: row.youtubeUrl ?? "",
    };
  }
}

export default new SettingsService();
