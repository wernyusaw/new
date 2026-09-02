import { describe, expect, it, jest } from "@jest/globals";
import type { Request, Response } from "express";

import { HelloController } from "../../src/controllers/hello.controller";
import type { HelloServicePort } from "../../src/interfaces/hello-service.port";
import type { AppConfig } from "../../src/interfaces/app-config";

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

function buildMockResponse(): jest.Mocked<Response> {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as jest.Mocked<Response>;
}

describe("HelloController", () => {
  it("returns 200 with the built hello message", () => {
    // Arrange
    const helloServiceMock: jest.Mocked<HelloServicePort> = {
      buildMessage: jest.fn().mockReturnValue("Hello, Tom"),
    };
    const controller = new HelloController(helloServiceMock, appConfigMock);
    const request = { query: { name: "Tom" } } as unknown as Request;
    const response = buildMockResponse();

    // Act
    controller.getHello(request, response);

    // Assert
    expect(helloServiceMock.buildMessage).toHaveBeenCalledWith("Tom");
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ resultCode: 200, resultData: { message: "Hello, Tom" } }),
    );
  });

  it("falls back to the configured default name when query.name is missing", () => {
    // Arrange
    const helloServiceMock: jest.Mocked<HelloServicePort> = {
      buildMessage: jest.fn().mockReturnValue("Hello, Saw"),
    };
    const controller = new HelloController(helloServiceMock, appConfigMock);
    const request = { query: {} } as unknown as Request;
    const response = buildMockResponse();

    // Act
    controller.getHello(request, response);

    // Assert
    expect(helloServiceMock.buildMessage).toHaveBeenCalledWith("Saw");
  });
});
