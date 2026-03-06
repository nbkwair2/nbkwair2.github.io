import "dotenv/config";
import { createApp } from "./app";

const PORT = parseInt(process.env["API_PORT"] ?? "4000", 10);
const HOST = process.env["API_HOST"] ?? "0.0.0.0";

const app = createApp();

const server = app.listen(PORT, HOST, () => {
  console.info(`🚀 API server running at http://${HOST}:${PORT}`);
  console.info(`📖 Environment: ${process.env["NODE_ENV"] ?? "development"}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.info("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.info("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.info("SIGINT received, shutting down gracefully...");
  server.close(() => {
    console.info("Server closed");
    process.exit(0);
  });
});
