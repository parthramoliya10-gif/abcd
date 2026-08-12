import cors from "cors";
import { env } from "./env.js";

export const corsOptions: cors.CorsOptions = {
  origin: env.FRONTEND_URL,
  credentials: true,
};
