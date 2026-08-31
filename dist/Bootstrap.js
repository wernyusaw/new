"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
exports.bootstrap = bootstrap;
const express_1 = __importDefault(require("express"));
const tsyringe_1 = require("tsyringe");
const mysql_1 = require("./src/db/mysql");
const injection_tokens_1 = require("./src/di/injection-tokens");
const hello_route_1 = require("./src/routes/hello.route");
const greeting_route_1 = require("./src/routes/greeting.route");
const calculate_route_1 = require("./src/routes/calculate.route");
const profile_route_1 = require("./src/routes/profile.route");
const DEFAULT_PORT = 3000;
const apiRouters = [
    hello_route_1.helloRouter,
    greeting_route_1.greetingRouter,
    calculate_route_1.calculateRouter,
    profile_route_1.profileRouter,
];
async function getDatabaseHealth(appConfig) {
    const isDbEnabled = process.env.DB_ENABLED === "true";
    if (!isDbEnabled) {
        return {
            enabled: false,
            status: "disabled",
        };
    }
    try {
        const pool = await (0, mysql_1.getMySqlPool)(appConfig);
        await pool.query("SELECT 1");
        return {
            enabled: true,
            status: "up",
        };
    }
    catch (error) {
        return {
            enabled: true,
            status: "down",
            error: error instanceof Error ? error.message : "Unknown database error",
        };
    }
}
async function getKafkaHealth(appConfig) {
    if (!appConfig.kafkaEnabled) {
        return {
            enabled: false,
            status: "disabled",
        };
    }
    try {
        const eventPublisher = tsyringe_1.container.resolve(injection_tokens_1.ServiceTokens.EventPublisher);
        await eventPublisher.connect();
        return {
            enabled: true,
            status: "up",
        };
    }
    catch (error) {
        return {
            enabled: true,
            status: "down",
            error: error instanceof Error ? error.message : "Unknown Kafka error",
        };
    }
}
function createApp() {
    const app = (0, express_1.default)();
    const appConfig = tsyringe_1.container.resolve(injection_tokens_1.ServiceTokens.AppConfig);
    app.use(express_1.default.json());
    app.get("/health", async (_request, response) => {
        const [databaseHealth, kafkaHealth] = await Promise.all([
            getDatabaseHealth(appConfig),
            getKafkaHealth(appConfig),
        ]);
        const hasUnavailableDependency = databaseHealth.status === "down" || kafkaHealth.status === "down";
        const healthResponse = {
            status: hasUnavailableDependency ? "degraded" : "ok",
            timestamp: new Date().toISOString(),
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
async function bootstrap() {
    const appConfig = tsyringe_1.container.resolve(injection_tokens_1.ServiceTokens.AppConfig);
    if (process.env.DB_ENABLED === "true") {
        await (0, mysql_1.getMySqlPool)(appConfig);
    }
    if (appConfig.kafkaEnabled) {
        const eventPublisher = tsyringe_1.container.resolve(injection_tokens_1.ServiceTokens.EventPublisher);
        await eventPublisher.connect();
    }
    const app = createApp();
    app.listen(DEFAULT_PORT, () => {
        console.log(`Server is running on http://localhost:${DEFAULT_PORT}`);
    });
}
