import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/database";
import { logger } from "./utils/logger";

async function main() {
  try {
    // Verify database connection
    await prisma.$connect();
    logger.info("Database connected successfully");

    // Start server
    app.listen(env.PORT, () => {
      logger.info(`Server running on http://localhost:${env.PORT}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
      logger.info(`CORS origin: ${env.CORS_ORIGIN}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  logger.info("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.info("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

main();
