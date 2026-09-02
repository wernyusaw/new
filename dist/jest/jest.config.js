"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    rootDir: "..",
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/tests"],
    setupFiles: ["<rootDir>/jest/jest.setup.ts"],
    moduleFileExtensions: ["ts", "js", "json"],
    clearMocks: true,
    collectCoverage: false,
    collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
    coverageDirectory: "<rootDir>/coverage",
    coverageReporters: ["text", "text-summary", "lcov", "html"],
};
exports.default = config;
