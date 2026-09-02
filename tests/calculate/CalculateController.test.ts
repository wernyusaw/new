import { describe, expect, it, jest } from "@jest/globals";
import type { Request, Response } from "express";

import { CalculateController } from "../../src/controllers/calculate.controller";
import type { CalculateServicePort } from "../../src/interfaces/calculate-service.port";
import type { AppConfig } from "../../src/interfaces/app-config";

const appConfigMock = {} as AppConfig;

function buildMockResponse(): jest.Mocked<Response> {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as jest.Mocked<Response>;
}

describe("CalculateController", () => {
  it("returns 200 with the calculated result for a valid request", () => {
    // Arrange
    const calculateServiceMock: jest.Mocked<CalculateServicePort> = {
      calculateValueChange: jest.fn().mockReturnValue({
        operation: "increase",
        originalValue: 10,
        changeBy: 5,
        changedValue: 15,
      }),
    };
    const controller = new CalculateController(appConfigMock, calculateServiceMock);
    const request = { body: { currentValue: 10, changeBy: 5, operation: "increase" } } as unknown as Request;
    const response = buildMockResponse();

    // Act
    controller.calculateValueChange(request, response);

    // Assert
    expect(calculateServiceMock.calculateValueChange).toHaveBeenCalledWith({
      currentValue: 10,
      changeBy: 5,
      operation: "increase",
    });
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ resultCode: 200, resultData: expect.objectContaining({ changedValue: 15 }) }),
    );
  });

  it("returns 400 when the request payload is invalid", () => {
    // Arrange
    const calculateServiceMock: jest.Mocked<CalculateServicePort> = {
      calculateValueChange: jest.fn(),
    };
    const controller = new CalculateController(appConfigMock, calculateServiceMock);
    const request = { body: { currentValue: "10", changeBy: 5, operation: "increase" } } as unknown as Request;
    const response = buildMockResponse();

    // Act
    controller.calculateValueChange(request, response);

    // Assert
    expect(calculateServiceMock.calculateValueChange).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ resultCode: 400 }));
  });
});
