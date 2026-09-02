import { describe, expect, it, jest } from "@jest/globals";

import type { AppConfig } from "../../src/interfaces/app-config";
import type { EventPublisherPort } from "../../src/interfaces/event-publisher.port";
import type { GreetingRepositoryPort } from "../../src/interfaces/greeting-repository.port";
import { GreetingService } from "../../src/services/greeting.service";

const appConfigMock: AppConfig = {
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

describe("GreetingService", () => {
  function buildService(appConfig: AppConfig) {
    const repositoryMock: jest.Mocked<GreetingRepositoryPort> = {
      saveGreeting: jest.fn().mockResolvedValue(undefined),
      getGreetingByName: jest.fn(),
    };
    const eventPublisherMock: jest.Mocked<EventPublisherPort> = {
      connect: jest.fn().mockResolvedValue(undefined),
      publishGreetingCreated: jest.fn().mockResolvedValue(undefined),
    };

    return { service: new GreetingService(repositoryMock, appConfig, eventPublisherMock), repositoryMock, eventPublisherMock };
  }

  it("returns a casual message, persists it and publishes an event", async () => {
    // Arrange
    const { service, repositoryMock, eventPublisherMock } = buildService(appConfigMock);

    // Act
    const message = await service.buildMessage({ name: "Tom" });

    // Assert
    expect(message).toBe("Greetings, Tom");
    expect(repositoryMock.saveGreeting).toHaveBeenCalledWith("Tom", "Greetings, Tom");
    expect(eventPublisherMock.publishGreetingCreated).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Tom", message: "Greetings, Tom" }),
    );
  });

  it("returns a formatted message when getGreetingByName finds a saved message", async () => {
    // Arrange
    const { service, repositoryMock } = buildService(appConfigMock);
    repositoryMock.getGreetingByName.mockResolvedValue("Greetings, Tom");

    // Act
    const result = await service.getGreetingByName({ name: "Tom" });

    // Assert
    expect(repositoryMock.getGreetingByName).toHaveBeenCalledWith("Tom");
    expect(result).toBe("Message from Tom is Greetings, Tom");
  });

  it("returns null when getGreetingByName finds nothing", async () => {
    // Arrange
    const { service, repositoryMock } = buildService(appConfigMock);
    repositoryMock.getGreetingByName.mockResolvedValue(null);

    // Act
    const result = await service.getGreetingByName({ name: "Unknown" });

    // Assert
    expect(result).toBeNull();
  });
});
