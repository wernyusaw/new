import { describe, expect, it } from "@jest/globals";

import { getGreetingMessage } from "../../src/usecases/getGreetingMessageUsecase";

describe("getGreetingMessage", () => {
  it("returns a casual greeting by default", () => {
    // Arrange & Act
    const result = getGreetingMessage("Tom");

    // Assert
    expect(result).toBe("Greetings, Tom");
  });

  it("returns a casual greeting when style is casual", () => {
    // Arrange & Act
    const result = getGreetingMessage("Tom", "casual");

    // Assert
    expect(result).toBe("Greetings, Tom");
  });

  it("returns a formal greeting when style is formal", () => {
    // Arrange & Act
    const result = getGreetingMessage("Tom", "formal");

    // Assert
    expect(result).toBe("Good day, Tom");
  });
});
