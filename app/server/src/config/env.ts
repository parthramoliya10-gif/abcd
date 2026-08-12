import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",

  PORT: Number(process.env.PORT ?? 5000),

  DATABASE_URL: required("DATABASE_URL"),

  JWT_ACCESS_SECRET: required("JWT_ACCESS_SECRET"),

  JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET"),

  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",

  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",

  FRONTEND_URL: process.env.FRONTEND_URL ?? "http://localhost:5173",

  BCRYPT_SALT_ROUNDS: Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),

  SMTP_HOST: process.env.SMTP_HOST,

  SMTP_PORT: Number(process.env.SMTP_PORT ?? 465),

  SMTP_USER: process.env.SMTP_USER,

  SMTP_PASS: process.env.SMTP_PASS,

  MAIL_FROM:
    process.env.MAIL_FROM ?? "Promise Jewels <noreply@promisejewels.com>",

  OTP_EXPIRY_MINUTES: Number(process.env.OTP_EXPIRY_MINUTES ?? 5),

  SUPABASE_URL: required("SUPABASE_URL"),

  SUPABASE_ANON_KEY: required("SUPABASE_ANON_KEY"),

  SUPABASE_SERVICE_ROLE_KEY: required("SUPABASE_SERVICE_ROLE_KEY"),

  // SUPABASE_BUCKET:required("SUPABASE_BUCKET"),

  SITE_NAME: required("SITE_NAME"),

  SITE_URL: required("SITE_URL"),

  //seo

  DEFAULT_OG_IMAGE: process.env.DEFAULT_OG_IMAGE ?? "/images/default-og.png",
};
