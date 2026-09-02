"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const getHelloMessageUsecase_1 = require("../../src/usecases/getHelloMessageUsecase");
(0, globals_1.describe)("getHelloMessage", () => {
    (0, globals_1.it)("returns a hello message for the given name", () => {
        // Arrange & Act
        const result = (0, getHelloMessageUsecase_1.getHelloMessage)("Saw");
        // Assert
        (0, globals_1.expect)(result).toBe("Hello, Saw");
    });
});
