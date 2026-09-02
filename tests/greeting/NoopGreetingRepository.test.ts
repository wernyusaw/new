import { describe, expect, it } from "@jest/globals";

import { NoopGreetingRepository } from "../../src/repositories/noop-greeting.repository";

describe("NoopGreetingRepository", () => {
  it("resolves without error when saving a greeting", async () => {
    // Arrange
    const repository = new NoopGreetingRepository();

    // Act & Assert
    await expect(repository.saveGreeting("Tom", "Hello, Tom")).resolves.toBeUndefined();
  });

  it("always returns null when getting a greeting by name", async () => {
    // Arrange
    const repository = new NoopGreetingRepository();

    // Act
    const result = await repository.getGreetingByName("Tom");

    // Assert
    expect(result).toBeNull();
  });
});
