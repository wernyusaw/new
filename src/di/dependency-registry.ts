import { container } from "tsyringe";
import dotenv from "dotenv";

import { ServiceTokens } from "./injection-tokens";
import type { AppConfig } from "../interfaces/app-config";
import type { EventPublisherPort } from "../interfaces/event-publisher.port";
import type { GreetingRepositoryPort } from "../interfaces/greeting-repository.port";
import type { GreetingServicePort } from "../interfaces/greeting-service.port";
import type { HelloServicePort } from "../interfaces/hello-service.port";
import type { CalculateServicePort } from "../interfaces/calculate-service.port";
import type { ProfileRepositoryPort } from "../interfaces/profile-repository.port";
import type { ProfileServicePort } from "../interfaces/profile-service.port";
import { KafkaEventPublisher } from "../publishers/kafka-event.publisher";
import { NoopEventPublisher } from "../publishers/noop-event.publisher";
import { MySqlGreetingRepository } from "../repositories/mysql-greeting.repository";
import { MySqlProfileRepository } from "../repositories/mysql-profile.repository";
import { NoopGreetingRepository } from "../repositories/noop-greeting.repository";
import { NoopProfileRepository } from "../repositories/noop-profile.repository";
import { GreetingService } from "../services/greeting.service";
import { HelloService } from "../services/hello.service";
import { CalculateService } from "../services/calculate.service";
import { ProfileService } from "../services/profile.service";

dotenv.config();

const appConfig: AppConfig = {
  defaultName: "Saw",
  greetingStyle: process.env.GREETING_STYLE === "formal" ? "formal" : "casual",
  dbHost: process.env.DB_HOST ?? "localhost",
  dbPort: Number(process.env.DB_PORT ?? "3306"),
  dbUser: process.env.DB_USER ?? "root",
  dbPassword: process.env.DB_PASSWORD ?? "root",
  dbName: process.env.DB_NAME ?? "app_db",
  kafkaEnabled: process.env.KAFKA_ENABLED === "true",
  kafkaBrokers: (process.env.KAFKA_BROKERS ?? "localhost:9092")
    .split(",")
    .map((broker) => broker.trim())
    .filter((broker) => broker.length > 0),
  kafkaClientId: process.env.KAFKA_CLIENT_ID ?? "simple-ts-express",
  kafkaTopicGreetingCreated: process.env.KAFKA_TOPIC_GREETING_CREATED ?? "greeting.created",
};

container.register<AppConfig>(ServiceTokens.AppConfig, {
  useValue: appConfig,
});

container.register<HelloServicePort>(ServiceTokens.HelloService, {
  useClass: HelloService,
});

const isDbEnabled = process.env.DB_ENABLED === "true";

const greetingRepository = isDbEnabled
  ? container.resolve(MySqlGreetingRepository)
  : container.resolve(NoopGreetingRepository);

const profileRepository = isDbEnabled
  ? container.resolve(MySqlProfileRepository)
  : container.resolve(NoopProfileRepository);

container.register<GreetingRepositoryPort>(ServiceTokens.GreetingRepository, {
  useValue: greetingRepository,
});

container.register<ProfileRepositoryPort>(ServiceTokens.ProfileRepository, {
  useValue: profileRepository,
});

const eventPublisher = appConfig.kafkaEnabled
  ? container.resolve(KafkaEventPublisher)
  : container.resolve(NoopEventPublisher);

container.register<EventPublisherPort>(ServiceTokens.EventPublisher, {
  useValue: eventPublisher,
});

container.register<GreetingServicePort>(ServiceTokens.GreetingService, {
  useClass: GreetingService,
});

container.register<ProfileServicePort>(ServiceTokens.ProfileService, {
  useClass: ProfileService,
});

container.register<CalculateServicePort>(ServiceTokens.CalculateService, {
  useClass: CalculateService,
});

export { container };
