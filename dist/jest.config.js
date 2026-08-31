"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/tests"],
    setupFiles: ["<rootDir>/jest.setup.ts"],
    moduleFileExtensions: ["ts", "js", "json"],
    clearMocks: true,
};
exports.default = config;
