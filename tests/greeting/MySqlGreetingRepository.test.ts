import { describe, expect, it, jest, beforeEach } from "@jest/globals";

import { MySqlGreetingRepository } from "../../src/repositories/mysql-greeting.repository";
import * as mysqlModule from "../../src/db/mysql";
import type { AppConfig } from "../../src/interfaces/app-config";

jest.mock("../../src/db/mysql");

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

describe("MySqlGreetingRepository", () => {
  let executeMock: jest.Mock;

  beforeEach(() => {
    executeMock = jest.fn();
    jest.spyOn(mysqlModule, "getMySqlPool").mockResolvedValue({ execute: executeMock } as never);
  });

  it("inserts a greeting using a parameterized query", async () => {
    // Arrange
    executeMock.mockResolvedValue([{}]);
    const repository = new MySqlGreetingRepository(appConfigMock);

    // Act
    await repository.saveGreeting("Tom", "Hello, Tom");

    // Assert
    expect(executeMock).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO greetings"),
      ["Tom", "Hello, Tom"],
    );
  });

  it("returns the message when a greeting is found", async () => {
    // Arrange
    executeMock.mockResolvedValue([[{ message: "Hello, Tom" }]]);
    const repository = new MySqlGreetingRepository(appConfigMock);

    // Act
    const result = await repository.getGreetingByName("Tom");

    // Assert
    expect(executeMock).toHaveBeenCalledWith(
      expect.stringContaining("SELECT message FROM greetings"),
      ["Tom"],
    );
    expect(result).toBe("Hello, Tom");
  });

  it("returns null when no greeting is found", async () => {
    // Arrange
    executeMock.mockResolvedValue([[]]);
    const repository = new MySqlGreetingRepository(appConfigMock);

    // Act
    const result = await repository.getGreetingByName("Unknown");

    // Assert
    expect(result).toBeNull();
  });
});
