import { describe, expect, it } from "@jest/globals";

import { calculateValueChangeUsecase } from "../../src/usecases/calculateUsecase";

describe("calculateValueChangeUsecase", () => {
  it("increases the current value by changeBy", () => {
    // Arrange
    const input = { currentValue: 100, changeBy: 25, operation: "increase" as const };

    // Act
    const result = calculateValueChangeUsecase(input);

    // Assert
    expect(result).toEqual({
      operation: "increase",
      originalValue: 100,
      changeBy: 25,
      changedValue: 125,
    });
  });

  it("decreases the current value by changeBy", () => {
    // Arrange
    const input = { currentValue: 100, changeBy: 25, operation: "decrease" as const };

    // Act
    const result = calculateValueChangeUsecase(input);

    // Assert
    expect(result).toEqual({
      operation: "decrease",
      originalValue: 100,
      changeBy: 25,
      changedValue: 75,
    });
  });

  it("supports negative results when decreasing below zero", () => {
    // Arrange
    const input = { currentValue: 10, changeBy: 25, operation: "decrease" as const };

    // Act
    const result = calculateValueChangeUsecase(input);

    // Assert
    expect(result.changedValue).toBe(-15);
  });

  it("returns the same value when changeBy is zero", () => {
    // Arrange
    const input = { currentValue: 42, changeBy: 0, operation: "increase" as const };

    // Act
    const result = calculateValueChangeUsecase(input);

    // Assert
    expect(result.changedValue).toBe(42);
  });
});
