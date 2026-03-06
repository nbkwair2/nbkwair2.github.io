import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { authRouter } from "./routes/auth";
import { menuRouter } from "./routes/menu";
import { ordersRouter } from "./routes/orders";
import { notificationsRouter } from "./routes/notifications";
import { errorHandler } from "./middleware/errorHandler";

export function createApp(): Express {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(
    cors({
      origin: (process.env["CORS_ORIGIN"] ?? "http://localhost:3000")
        .split(",")
        .map((o) => o.trim()),
      credentials: true,
    })
  );

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/", limiter);

  // Parsing & compression
  app.use(compression());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Logging
  if (process.env["NODE_ENV"] !== "test") {
    app.use(morgan("combined"));
  }

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Routes
  app.use("/api/auth", authRouter);
  app.use("/api/menu", menuRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/notifications", notificationsRouter);

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({ success: false, error: "Not found" });
  });

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}
