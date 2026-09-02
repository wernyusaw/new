import { describe, expect, it } from "@jest/globals";

import { mapCalculateValueChangeRequest } from "../../src/mappers/request/calculate-request.mapper";

describe("calculate request mapper", () => {
  it("maps a valid increase request", () => {
    const request = { body: { currentValue: 100, changeBy: 10, operation: "increase" } };

    expect(mapCalculateValueChangeRequest(request)).toEqual({
      currentValue: 100,
      changeBy: 10,
      operation: "increase",
    });
  });

  it("maps a valid decrease request", () => {
    const request = { body: { currentValue: 100, changeBy: 10, operation: "decrease" } };

    expect(mapCalculateValueChangeRequest(request)).toEqual({
      currentValue: 100,
      changeBy: 10,
      operation: "decrease",
    });
  });

  it("returns null when currentValue is not a number", () => {
    const request = { body: { currentValue: "100", changeBy: 10, operation: "increase" } };

    expect(mapCalculateValueChangeRequest(request)).toBeNull();
  });

  it("returns null when changeBy is not a number", () => {
    const request = { body: { currentValue: 100, changeBy: "10", operation: "increase" } };

    expect(mapCalculateValueChangeRequest(request)).toBeNull();
  });

  it("returns null when currentValue is not finite", () => {
    const request = { body: { currentValue: Number.POSITIVE_INFINITY, changeBy: 10, operation: "increase" } };

    expect(mapCalculateValueChangeRequest(request)).toBeNull();
  });

  it("returns null when changeBy is not finite", () => {
    const request = { body: { currentValue: 100, changeBy: Number.NaN, operation: "increase" } };

    expect(mapCalculateValueChangeRequest(request)).toBeNull();
  });

  it("returns null when operation is invalid", () => {
    const request = { body: { currentValue: 100, changeBy: 10, operation: "multiply" } };

    expect(mapCalculateValueChangeRequest(request)).toBeNull();
  });

  it("returns null when operation is missing", () => {
    const request = { body: { currentValue: 100, changeBy: 10 } };

    expect(mapCalculateValueChangeRequest(request)).toBeNull();
  });
});
