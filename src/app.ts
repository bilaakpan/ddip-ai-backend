import express from "express";
import cors from "cors";
import helmet from "helmet";
import { corsOptions } from "./config/cors";
import { generalLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import { routes } from "./routes";

const app = express();

// ─── Security Middleware ───
app.use(helmet());
app.use(cors(corsOptions));
app.use(generalLimiter);

// ─── Body Parsing ───
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ───
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// ─── API Routes ───
app.use("/api", routes);

// ─── 404 Handler ───
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// ─── Global Error Handler ───
app.use(errorHandler);

export default app;
