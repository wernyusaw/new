"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const getGreetingMessageUsecase_1 = require("../../src/usecases/getGreetingMessageUsecase");
(0, globals_1.describe)("getGreetingMessage", () => {
    (0, globals_1.it)("returns a casual greeting by default", () => {
        // Arrange & Act
        const result = (0, getGreetingMessageUsecase_1.getGreetingMessage)("Tom");
        // Assert
        (0, globals_1.expect)(result).toBe("Greetings, Tom");
    });
    (0, globals_1.it)("returns a casual greeting when style is casual", () => {
        // Arrange & Act
        const result = (0, getGreetingMessageUsecase_1.getGreetingMessage)("Tom", "casual");
        // Assert
        (0, globals_1.expect)(result).toBe("Greetings, Tom");
    });
    (0, globals_1.it)("returns a formal greeting when style is formal", () => {
        // Arrange & Act
        const result = (0, getGreetingMessageUsecase_1.getGreetingMessage)("Tom", "formal");
        // Assert
        (0, globals_1.expect)(result).toBe("Good day, Tom");
    });
});
