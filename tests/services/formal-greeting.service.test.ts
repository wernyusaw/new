import { describe, expect, it } from "@jest/globals";

import { GreetingService } from "../../src/services/greeting.service";

describe("GreetingService", () => {
  it("returns a formal message when app config style is formal", async () => {
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
      greetingStyle: "formal" as const,
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
    const service = new GreetingService(repositoryMock, appConfigMock, eventPublisherMock);

    await expect(service.buildMessage({ name: "Tom" })).resolves.toBe("Good day, Tom");
    expect(repositoryMock.saveGreeting).toHaveBeenCalledWith("Tom", "Good day, Tom");
    expect(eventPublisherMock.publishGreetingCreated).toHaveBeenCalledTimes(1);
  });
});
