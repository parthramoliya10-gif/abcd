import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.js";
import { JwtPayload } from "../modules/auth/auth.types.js";

export const generateAccessToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    jwtConfig.accessSecret as Secret,
    {
      expiresIn: jwtConfig.accessExpiresIn,
    } as SignOptions,
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    jwtConfig.refreshSecret as Secret,
    {
      expiresIn: jwtConfig.refreshExpiresIn,
    } as SignOptions,
  );
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, jwtConfig.accessSecret) as JwtPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, jwtConfig.refreshSecret) as JwtPayload;
};
