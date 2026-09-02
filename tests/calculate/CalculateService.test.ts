import { describe, expect, it, jest } from "@jest/globals";

import { CalculateService } from "../../src/services/calculate.service";
import * as calculateUsecaseModule from "../../src/usecases/calculateUsecase";

jest.mock("../../src/usecases/calculateUsecase");

describe("CalculateService", () => {
  it("delegates calculateValueChange to the usecase and returns its result", () => {
    // Arrange
    const input = { currentValue: 10, changeBy: 5, operation: "increase" as const };
    const expected = { operation: "increase" as const, originalValue: 10, changeBy: 5, changedValue: 15 };
    jest.spyOn(calculateUsecaseModule, "calculateValueChangeUsecase").mockReturnValue(expected);
    const service = new CalculateService();

    // Act
    const result = service.calculateValueChange(input);

    // Assert
    expect(calculateUsecaseModule.calculateValueChangeUsecase).toHaveBeenCalledWith(input);
    expect(result).toEqual(expected);
  });
});
