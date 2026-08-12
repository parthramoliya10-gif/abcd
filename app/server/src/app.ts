import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";

import { corsOptions } from "./config/cors.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/notFound.middleware.js";
import routes from "./routes/index.js";

const app = express();

// Security headders ke liye hai 
app.use(helmet());

// CORS
app.use(cors(corsOptions));

// Logger
app.use(morgan("dev"));

// Compression
app.use(compression());

// Body Parsers for parsing JSON and URL-encoded data okay!
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public")); //for images haahha

// Cookies
app.use(cookieParser());

// Health Check
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Promise Jewel API is running 🚀",
  });
});

// API Routes
app.use("/api/v1", routes);

// 404
app.use(notFoundMiddleware);

// Global Error Handler
app.use(errorMiddleware);


export default app;
