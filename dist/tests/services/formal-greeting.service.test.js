"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const greeting_service_1 = require("../../src/services/greeting.service");
(0, globals_1.describe)("GreetingService", () => {
    (0, globals_1.it)("returns a formal message when app config style is formal", async () => {
        const repositoryMock = {
            saveGreeting: jest.fn().mockResolvedValue(undefined),
            getGreetingByName: jest.fn().mockResolvedValue(null),
        };
        const eventPublisherMock = {
            connect: jest.fn().mockResolvedValue(undefined),
            publishGreetingCreated: jest.fn().mockResolvedValue(undefined),
        };
        const appConfigMock = {
            defaultName: "Saw",
            greetingStyle: "formal",
            dbHost: "localhost",
            dbPort: 3306,
            dbUser: "app_user",
            dbPassword: "app_password",
            dbName: "app_db",
            kafkaEnabled: false,
            kafkaBrokers: ["localhost:9092"],
            kafkaClientId: "simple-ts-express",
            kafkaTopicGreetingCreated: "greeting.created",
        };
        const service = new greeting_service_1.GreetingService(repositoryMock, appConfigMock, eventPublisherMock);
        await (0, globals_1.expect)(service.buildMessage({ name: "Tom" })).resolves.toBe("Good day, Tom");
        (0, globals_1.expect)(repositoryMock.saveGreeting).toHaveBeenCalledWith("Tom", "Good day, Tom");
        (0, globals_1.expect)(eventPublisherMock.publishGreetingCreated).toHaveBeenCalledTimes(1);
    });
});
