"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const calculateUsecase_1 = require("../../src/usecases/calculateUsecase");
(0, globals_1.describe)("calculateValueChangeUsecase", () => {
    (0, globals_1.it)("increases the current value by changeBy", () => {
        // Arrange
        const input = { currentValue: 100, changeBy: 25, operation: "increase" };
        // Act
        const result = (0, calculateUsecase_1.calculateValueChangeUsecase)(input);
        // Assert
        (0, globals_1.expect)(result).toEqual({
            operation: "increase",
            originalValue: 100,
            changeBy: 25,
            changedValue: 125,
        });
    });
    (0, globals_1.it)("decreases the current value by changeBy", () => {
        // Arrange
        const input = { currentValue: 100, changeBy: 25, operation: "decrease" };
        // Act
        const result = (0, calculateUsecase_1.calculateValueChangeUsecase)(input);
        // Assert
        (0, globals_1.expect)(result).toEqual({
            operation: "decrease",
            originalValue: 100,
            changeBy: 25,
            changedValue: 75,
        });
    });
    (0, globals_1.it)("supports negative results when decreasing below zero", () => {
        // Arrange
        const input = { currentValue: 10, changeBy: 25, operation: "decrease" };
        // Act
        const result = (0, calculateUsecase_1.calculateValueChangeUsecase)(input);
        // Assert
        (0, globals_1.expect)(result.changedValue).toBe(-15);
    });
    (0, globals_1.it)("returns the same value when changeBy is zero", () => {
        // Arrange
        const input = { currentValue: 42, changeBy: 0, operation: "increase" };
        // Act
        const result = (0, calculateUsecase_1.calculateValueChangeUsecase)(input);
        // Assert
        (0, globals_1.expect)(result.changedValue).toBe(42);
    });
});
