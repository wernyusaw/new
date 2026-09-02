"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const greeting_service_1 = require("../../src/services/greeting.service");
const appConfigMock = {
    defaultName: "Saw",
    greetingStyle: "casual",
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
(0, globals_1.describe)("GreetingService", () => {
    function buildService(appConfig) {
        const repositoryMock = {
            saveGreeting: globals_1.jest.fn().mockResolvedValue(undefined),
            getGreetingByName: globals_1.jest.fn(),
        };
        const eventPublisherMock = {
            connect: globals_1.jest.fn().mockResolvedValue(undefined),
            publishGreetingCreated: globals_1.jest.fn().mockResolvedValue(undefined),
        };
        return { service: new greeting_service_1.GreetingService(repositoryMock, appConfig, eventPublisherMock), repositoryMock, eventPublisherMock };
    }
    (0, globals_1.it)("returns a casual message, persists it and publishes an event", async () => {
        // Arrange
        const { service, repositoryMock, eventPublisherMock } = buildService(appConfigMock);
        // Act
        const message = await service.buildMessage({ name: "Tom" });
        // Assert
        (0, globals_1.expect)(message).toBe("Greetings, Tom");
        (0, globals_1.expect)(repositoryMock.saveGreeting).toHaveBeenCalledWith("Tom", "Greetings, Tom");
        (0, globals_1.expect)(eventPublisherMock.publishGreetingCreated).toHaveBeenCalledWith(globals_1.expect.objectContaining({ name: "Tom", message: "Greetings, Tom" }));
    });
    (0, globals_1.it)("returns a formatted message when getGreetingByName finds a saved message", async () => {
        // Arrange
        const { service, repositoryMock } = buildService(appConfigMock);
        repositoryMock.getGreetingByName.mockResolvedValue("Greetings, Tom");
        // Act
        const result = await service.getGreetingByName({ name: "Tom" });
        // Assert
        (0, globals_1.expect)(repositoryMock.getGreetingByName).toHaveBeenCalledWith("Tom");
        (0, globals_1.expect)(result).toBe("Message from Tom is Greetings, Tom");
    });
    (0, globals_1.it)("returns null when getGreetingByName finds nothing", async () => {
        // Arrange
        const { service, repositoryMock } = buildService(appConfigMock);
        repositoryMock.getGreetingByName.mockResolvedValue(null);
        // Act
        const result = await service.getGreetingByName({ name: "Unknown" });
        // Assert
        (0, globals_1.expect)(result).toBeNull();
    });
});
