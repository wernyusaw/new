"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const tsyringe_1 = require("tsyringe");
Object.defineProperty(exports, "container", { enumerable: true, get: function () { return tsyringe_1.container; } });
const dotenv_1 = __importDefault(require("dotenv"));
const injection_tokens_1 = require("./injection-tokens");
const kafka_event_publisher_1 = require("../publishers/kafka-event.publisher");
const noop_event_publisher_1 = require("../publishers/noop-event.publisher");
const mysql_greeting_repository_1 = require("../repositories/mysql-greeting.repository");
const mysql_profile_repository_1 = require("../repositories/mysql-profile.repository");
const noop_greeting_repository_1 = require("../repositories/noop-greeting.repository");
const noop_profile_repository_1 = require("../repositories/noop-profile.repository");
const greeting_service_1 = require("../services/greeting.service");
const hello_service_1 = require("../services/hello.service");
const calculate_service_1 = require("../services/calculate.service");
const profile_service_1 = require("../services/profile.service");
dotenv_1.default.config();
const appConfig = {
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
tsyringe_1.container.register(injection_tokens_1.ServiceTokens.AppConfig, {
    useValue: appConfig,
});
tsyringe_1.container.register(injection_tokens_1.ServiceTokens.HelloService, {
    useClass: hello_service_1.HelloService,
});
const isDbEnabled = process.env.DB_ENABLED === "true";
const greetingRepository = isDbEnabled
    ? tsyringe_1.container.resolve(mysql_greeting_repository_1.MySqlGreetingRepository)
    : tsyringe_1.container.resolve(noop_greeting_repository_1.NoopGreetingRepository);
const profileRepository = isDbEnabled
    ? tsyringe_1.container.resolve(mysql_profile_repository_1.MySqlProfileRepository)
    : tsyringe_1.container.resolve(noop_profile_repository_1.NoopProfileRepository);
tsyringe_1.container.register(injection_tokens_1.ServiceTokens.GreetingRepository, {
    useValue: greetingRepository,
});
tsyringe_1.container.register(injection_tokens_1.ServiceTokens.ProfileRepository, {
    useValue: profileRepository,
});
const eventPublisher = appConfig.kafkaEnabled
    ? tsyringe_1.container.resolve(kafka_event_publisher_1.KafkaEventPublisher)
    : tsyringe_1.container.resolve(noop_event_publisher_1.NoopEventPublisher);
tsyringe_1.container.register(injection_tokens_1.ServiceTokens.EventPublisher, {
    useValue: eventPublisher,
});
tsyringe_1.container.register(injection_tokens_1.ServiceTokens.GreetingService, {
    useClass: greeting_service_1.GreetingService,
});
tsyringe_1.container.register(injection_tokens_1.ServiceTokens.ProfileService, {
    useClass: profile_service_1.ProfileService,
});
tsyringe_1.container.register(injection_tokens_1.ServiceTokens.CalculateService, {
    useClass: calculate_service_1.CalculateService,
});
