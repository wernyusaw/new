"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const noop_greeting_repository_1 = require("../../src/repositories/noop-greeting.repository");
(0, globals_1.describe)("NoopGreetingRepository", () => {
    (0, globals_1.it)("resolves without error when saving a greeting", async () => {
        // Arrange
        const repository = new noop_greeting_repository_1.NoopGreetingRepository();
        // Act & Assert
        await (0, globals_1.expect)(repository.saveGreeting("Tom", "Hello, Tom")).resolves.toBeUndefined();
    });
    (0, globals_1.it)("always returns null when getting a greeting by name", async () => {
        // Arrange
        const repository = new noop_greeting_repository_1.NoopGreetingRepository();
        // Act
        const result = await repository.getGreetingByName("Tom");
        // Assert
        (0, globals_1.expect)(result).toBeNull();
    });
});
