"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const calculate_controller_1 = require("../../src/controllers/calculate.controller");
const appConfigMock = {};
function buildMockResponse() {
    return {
        status: globals_1.jest.fn().mockReturnThis(),
        json: globals_1.jest.fn().mockReturnThis(),
    };
}
(0, globals_1.describe)("CalculateController", () => {
    (0, globals_1.it)("returns 200 with the calculated result for a valid request", () => {
        // Arrange
        const calculateServiceMock = {
            calculateValueChange: globals_1.jest.fn().mockReturnValue({
                operation: "increase",
                originalValue: 10,
                changeBy: 5,
                changedValue: 15,
            }),
        };
        const controller = new calculate_controller_1.CalculateController(appConfigMock, calculateServiceMock);
        const request = { body: { currentValue: 10, changeBy: 5, operation: "increase" } };
        const response = buildMockResponse();
        // Act
        controller.calculateValueChange(request, response);
        // Assert
        (0, globals_1.expect)(calculateServiceMock.calculateValueChange).toHaveBeenCalledWith({
            currentValue: 10,
            changeBy: 5,
            operation: "increase",
        });
        (0, globals_1.expect)(response.status).toHaveBeenCalledWith(200);
        (0, globals_1.expect)(response.json).toHaveBeenCalledWith(globals_1.expect.objectContaining({ resultCode: 200, resultData: globals_1.expect.objectContaining({ changedValue: 15 }) }));
    });
    (0, globals_1.it)("returns 400 when the request payload is invalid", () => {
        // Arrange
        const calculateServiceMock = {
            calculateValueChange: globals_1.jest.fn(),
        };
        const controller = new calculate_controller_1.CalculateController(appConfigMock, calculateServiceMock);
        const request = { body: { currentValue: "10", changeBy: 5, operation: "increase" } };
        const response = buildMockResponse();
        // Act
        controller.calculateValueChange(request, response);
        // Assert
        (0, globals_1.expect)(calculateServiceMock.calculateValueChange).not.toHaveBeenCalled();
        (0, globals_1.expect)(response.status).toHaveBeenCalledWith(400);
        (0, globals_1.expect)(response.json).toHaveBeenCalledWith(globals_1.expect.objectContaining({ resultCode: 400 }));
    });
});
