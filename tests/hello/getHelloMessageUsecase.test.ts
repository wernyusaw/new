import { describe, expect, it } from "@jest/globals";

import { getHelloMessage } from "../../src/usecases/getHelloMessageUsecase";

describe("getHelloMessage", () => {
  it("returns a hello message for the given name", () => {
    // Arrange & Act
    const result = getHelloMessage("Saw");

    // Assert
    expect(result).toBe("Hello, Saw");
  });
});
