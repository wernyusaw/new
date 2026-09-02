import { describe, expect, it, jest } from "@jest/globals";
import type { Request, Response } from "express";

import { GreetingController } from "../../src/controllers/greeting.controller";
import type { GreetingServicePort } from "../../src/interfaces/greeting-service.port";
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

describe("GreetingController", () => {
  describe("getGreeting", () => {
    it("returns 200 with the built greeting message", async () => {
      // Arrange
      const greetingServiceMock: jest.Mocked<GreetingServicePort> = {
        buildMessage: jest.fn().mockResolvedValue("Greetings, Tom"),
        getGreetingByName: jest.fn(),
      };
      const controller = new GreetingController(greetingServiceMock, appConfigMock);
      const request = { query: { name: "Tom" } } as unknown as Request;
      const response = buildMockResponse();

      // Act
      await controller.getGreeting(request, response);

      // Assert
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({ resultData: { message: "Greetings, Tom" } }),
      );
    });

    it("returns 500 when the service throws", async () => {
      // Arrange
      const greetingServiceMock: jest.Mocked<GreetingServicePort> = {
        buildMessage: jest.fn().mockRejectedValue(new Error("db down")),
        getGreetingByName: jest.fn(),
      };
      const controller = new GreetingController(greetingServiceMock, appConfigMock);
      const request = { query: { name: "Tom" } } as unknown as Request;
      const response = buildMockResponse();

      // Act
      await controller.getGreeting(request, response);

      // Assert
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ resultCode: 500 }));
    });
  });

  describe("getGreetingByName", () => {
    it("returns 400 when name is empty", async () => {
      // Arrange
      const greetingServiceMock: jest.Mocked<GreetingServicePort> = {
        buildMessage: jest.fn(),
        getGreetingByName: jest.fn(),
      };
      const controller = new GreetingController(greetingServiceMock, appConfigMock);
      const request = { params: { name: "" } } as unknown as Request<{ name: string }>;
      const response = buildMockResponse();

      // Act
      await controller.getGreetingByName(request, response);

      // Assert
      expect(greetingServiceMock.getGreetingByName).not.toHaveBeenCalled();
      expect(response.status).toHaveBeenCalledWith(400);
    });

    it("returns 200 with the message when found", async () => {
      // Arrange
      const greetingServiceMock: jest.Mocked<GreetingServicePort> = {
        buildMessage: jest.fn(),
        getGreetingByName: jest.fn().mockResolvedValue("Message from Tom is Greetings, Tom"),
      };
      const controller = new GreetingController(greetingServiceMock, appConfigMock);
      const request = { params: { name: "Tom" } } as unknown as Request<{ name: string }>;
      const response = buildMockResponse();

      // Act
      await controller.getGreetingByName(request, response);

      // Assert
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({ resultData: { message: "Message from Tom is Greetings, Tom" } }),
      );
    });

    it("returns 404 when no greeting is found", async () => {
      // Arrange
      const greetingServiceMock: jest.Mocked<GreetingServicePort> = {
        buildMessage: jest.fn(),
        getGreetingByName: jest.fn().mockResolvedValue(null),
      };
      const controller = new GreetingController(greetingServiceMock, appConfigMock);
      const request = { params: { name: "Unknown" } } as unknown as Request<{ name: string }>;
      const response = buildMockResponse();

      // Act
      await controller.getGreetingByName(request, response);

      // Assert
      expect(response.status).toHaveBeenCalledWith(404);
    });

    it("returns 500 when the service throws", async () => {
      // Arrange
      const greetingServiceMock: jest.Mocked<GreetingServicePort> = {
        buildMessage: jest.fn(),
        getGreetingByName: jest.fn().mockRejectedValue(new Error("db down")),
      };
      const controller = new GreetingController(greetingServiceMock, appConfigMock);
      const request = { params: { name: "Tom" } } as unknown as Request<{ name: string }>;
      const response = buildMockResponse();

      // Act
      await controller.getGreetingByName(request, response);

      // Assert
      expect(response.status).toHaveBeenCalledWith(500);
    });
  });
});
