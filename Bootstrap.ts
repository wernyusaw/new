import express from "express";
import { container } from "tsyringe";

import { getMySqlPool } from "./src/db/mysql";
import { ServiceTokens } from "./src/di/injection-tokens";
import type { AppConfig } from "./src/interfaces/app-config";
import type { EventPublisherPort } from "./src/interfaces/event-publisher.port";
import { helloRouter } from "./src/routes/hello.route";
import { greetingRouter } from "./src/routes/greeting.route";
import { calculateRouter } from "./src/routes/calculate.route";
import { profileRouter } from "./src/routes/profile.route";
import { formatBangkokDateTime } from "./src/utils/date-time";

const DEFAULT_PORT = 3000;
const apiRouters: express.Router[] = [
  helloRouter,
  greetingRouter,
  calculateRouter,
  profileRouter,
];

interface DependencyHealth {
  enabled: boolean;
  status: "up" | "down" | "disabled";
  error?: string;
}

interface HealthResponse {
  status: "ok" | "degraded";
  timestamp: string;
  dependencies: {
    database: DependencyHealth;
    kafka: DependencyHealth;
  };
}

async function getDatabaseHealth(appConfig: AppConfig): Promise<DependencyHealth> {
  const isDbEnabled = process.env.DB_ENABLED === "true";

  if (!isDbEnabled) {
    return {
      enabled: false,
      status: "disabled",
    };
  }

  try {
    const pool = await getMySqlPool(appConfig);
    await pool.query("SELECT 1");

    return {
      enabled: true,
      status: "up",
    };
  } catch (error) {
    return {
      enabled: true,
      status: "down",
      error: error instanceof Error ? error.message : "Unknown database error",
    };
  }
}

async function getKafkaHealth(appConfig: AppConfig): Promise<DependencyHealth> {
  if (!appConfig.kafkaEnabled) {
    return {
      enabled: false,
      status: "disabled",
    };
  }

  try {
    const eventPublisher = container.resolve<EventPublisherPort>(ServiceTokens.EventPublisher);
    await eventPublisher.connect();

    return {
      enabled: true,
      status: "up",
    };
  } catch (error) {
    return {
      enabled: true,
      status: "down",
      error: error instanceof Error ? error.message : "Unknown Kafka error",
    };
  }
}

export function createApp(): express.Application {
  const app = express();
  const appConfig = container.resolve<AppConfig>(ServiceTokens.AppConfig);

  app.use(express.json());

  app.get("/health", async (_request, response) => {
    const [databaseHealth, kafkaHealth] = await Promise.all([
      getDatabaseHealth(appConfig),
      getKafkaHealth(appConfig),
    ]);

    const hasUnavailableDependency = databaseHealth.status === "down" || kafkaHealth.status === "down";

    const healthResponse: HealthResponse = {
      status: hasUnavailableDependency ? "degraded" : "ok",
      timestamp: formatBangkokDateTime(),
      dependencies: {
        database: databaseHealth,
        kafka: kafkaHealth,
      },
    };

    response.status(hasUnavailableDependency ? 503 : 200).json(healthResponse);
  });

  for (const router of apiRouters) {
    app.use("/api", router);
  }

  return app;
}

export async function bootstrap(): Promise<void> {
  const appConfig = container.resolve<AppConfig>(ServiceTokens.AppConfig);

  if (process.env.DB_ENABLED === "true") {
    await getMySqlPool(appConfig);
  }

  if (appConfig.kafkaEnabled) {
    const eventPublisher = container.resolve<EventPublisherPort>(ServiceTokens.EventPublisher);
    await eventPublisher.connect();
  }

  const app = createApp();

  app.listen(DEFAULT_PORT, () => {
    console.log(`Server is running on http://localhost:${DEFAULT_PORT}`);
  });
}
